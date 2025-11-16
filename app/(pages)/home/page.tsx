"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Users, Zap, ArrowRight, Calendar, FileText, Star } from "lucide-react";

interface DashboardHomeProps {
  onNewLogo: () => void;
}

export function DashboardHome({ onNewLogo }: DashboardHomeProps) {
  const supabase = createClient();
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get Counts
      const { count: total } = await supabase.from('logos').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      const { count: active } = await supabase.from('logos').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('archived', false);

      setStats({ total: total || 0, active: active || 0 });

      // Get Recent Activity (Limit 3)
      const { data } = await supabase
        .from('logos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (data) setRecentActivity(data);
    };
    
    fetchHomeData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
          <p className="text-gray-600 mt-2">Ready to create something amazing today?</p>
        </div>
        <Button onClick={onNewLogo} size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
          <Sparkles className="h-4 w-4" />
          Create New Logo
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Logos Created</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold mt-1">{stats.active}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest logo generations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Logo Generated</p>
                    <p className="text-sm text-gray-600">{activity.business_name}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && <p className="text-gray-500 text-sm">No recent activity.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={onNewLogo}>
                <Sparkles className="h-6 w-6" /> New Logo
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="h-6 w-6" /> Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}