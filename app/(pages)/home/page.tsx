"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Calendar,
  FileText,
  Star,
} from "lucide-react";

// Mock data for recent activity
const recentActivity = [
  {
    id: 1,
    action: "Logo Generated",
    businessName: "NovaTech",
    time: "2 hours ago",
    type: "success",
  },
  {
    id: 2,
    action: "Brand Guide Created",
    businessName: "BloomWell",
    time: "1 day ago",
    type: "info",
  },
  {
    id: 3,
    action: "Project Archived",
    businessName: "OldTech Solutions",
    time: "2 days ago",
    type: "warning",
  },
];

// Mock data for quick stats
const quickStats = [
  { label: "Logos Created", value: "24", change: "+12%", icon: Sparkles },
  { label: "Active Projects", value: "8", change: "+5%", icon: FileText },
  { label: "Team Members", value: "3", change: "+1", icon: Users },
  { label: "Satisfaction", value: "94%", change: "+3%", icon: Star },
];

interface DashboardHomeProps {
  onNewLogo: () => void;
}

export function DashboardHome({ onNewLogo }: DashboardHomeProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
          <p className="text-gray-600 mt-2">
            Ready to create something amazing today?
          </p>
        </div>
        <Button 
          onClick={onNewLogo} 
          size="lg" 
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Sparkles className="h-4 w-4" />
          Create New Logo
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <Badge variant="secondary" className="mt-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </Badge>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest logo generations and actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-100 text-green-600"
                        : activity.type === "warning"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">
                      {activity.businessName}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Activity
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used tools and features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                onClick={onNewLogo}
              >
                <Sparkles className="h-6 w-6" />
                New Logo
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="h-6 w-6" />
                Templates
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Calendar className="h-6 w-6" />
                History
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="h-6 w-6" />
                Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pro Tip */}
      <Card className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-none">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Pro Tip 💡</h3>
              <p className="opacity-90">
                Use specific industry keywords in your prompts for better logo
                generation results.
              </p>
            </div>
            <Button variant="secondary" size="sm" className="text-violet-700 hover:bg-white">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}