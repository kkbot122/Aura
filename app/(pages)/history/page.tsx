"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, Clock, Search, Archive, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DashboardHistoryProps {
  onNewLogo: () => void;
}

export function DashboardHistory({ onNewLogo }: DashboardHistoryProps) {
  const supabase = createClient();
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch History
  const fetchHistory = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      let query = supabase
        .from('logos')
        .select('*')
        .eq('user_id', user.id)
        .eq('archived', false)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('business_name', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (data) setHistoryItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [searchQuery]);

  // Handle Archive Action
  const handleArchive = async (id: string) => {
    const { error } = await supabase
      .from('logos')
      .update({ archived: true })
      .eq('id', id);
      
    if (!error) {
      // Remove from local state immediately
      setHistoryItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">Generation History</h1>
        <p className="text-gray-600">View your past logo generations</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input 
              placeholder="Search history..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Empty State */}
      {!loading && historyItems.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No generation history</h3>
            <Button onClick={onNewLogo}>Create Your First Logo</Button>
          </CardContent>
        </Card>
      )}

      {/* History List */}
      <div className="space-y-4">
        {historyItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {/* Logo Preview - Use actual URL if available */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border overflow-hidden">
                    {item.logo_url ? (
                      <img src={item.logo_url} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">{item.business_name.charAt(0)}</span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{item.business_name}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                      <Badge variant="secondary">{item.style}</Badge>
                      <Badge variant="outline">{item.industry}</Badge>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => item.logo_url && window.open(item.logo_url, '_blank')}
                    disabled={!item.logo_url}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500 hover:text-gray-900"
                    onClick={() => handleArchive(item.id)}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}