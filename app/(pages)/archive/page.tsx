"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Archive, Trash2, ArchiveRestore, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export function DashboardArchive() {
  const supabase = createClient();
  const [archivedItems, setArchivedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArchive = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('logos')
        .select('*')
        .eq('user_id', user.id)
        .eq('archived', true)
        .order('created_at', { ascending: false });
      
      if (data) setArchivedItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArchive();
  }, []);

  const handleRestore = async (id: string) => {
    const { error } = await supabase
      .from('logos')
      .update({ archived: false })
      .eq('id', id);
    if (!error) setArchivedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this permanently?")) return;
    const { error } = await supabase.from('logos').delete().eq('id', id);
    if (!error) setArchivedItems(prev => prev.filter(item => item.id !== id));
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">Archive</h1>
        <p className="text-gray-600">Manage your archived logos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-gray-900">{archivedItems.length}</div>
            <div className="text-gray-600">Archived Items</div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {archivedItems.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <div className="text-gray-400 mb-4">
              <Archive className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Archive is empty</h3>
          </CardContent>
        </Card>
      )}

      {/* Items */}
      <div className="space-y-4">
        {archivedItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border overflow-hidden opacity-75">
                     {item.logo_url ? (
                      <img src={item.logo_url} alt="Logo" className="w-full h-full object-contain grayscale" />
                    ) : (
                      <Archive className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-600">{item.business_name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Badge variant="outline">{item.style}</Badge>
                      <Badge variant="outline">{item.industry}</Badge>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleRestore(item.id)}>
                    <ArchiveRestore className="mr-2 h-4 w-4" />
                    Restore
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
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