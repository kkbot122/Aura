"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for history
const historyItems = [
  {
    id: 1,
    businessName: "NovaTech",
    style: "Futuristic",
    industry: "Technology",
    date: "2024-01-15",
    time: "14:30",
    logoUrl: "/api/placeholder/80/80",
    status: "completed",
  },
  {
    id: 2,
    businessName: "BloomWell",
    style: "Organic",
    industry: "Wellness",
    date: "2024-01-14",
    time: "11:15",
    logoUrl: "/api/placeholder/80/80",
    status: "completed",
  },
  {
    id: 3,
    businessName: "TechSphere",
    style: "Minimal",
    industry: "Software",
    date: "2024-01-13",
    time: "16:45",
    logoUrl: "/api/placeholder/80/80",
    status: "completed",
  },
  {
    id: 4,
    businessName: "Finova",
    style: "Luxury",
    industry: "Fintech",
    date: "2024-01-12",
    time: "09:20",
    logoUrl: "/api/placeholder/80/80",
    status: "completed",
  },
];

interface DashboardHistoryProps {
  onNewLogo: () => void;
}

export function DashboardHistory({ onNewLogo }: DashboardHistoryProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">Generation History</h1>
        <p className="text-gray-600">
          View your past logo generations and downloads
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input placeholder="Search history..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 days
              </Button>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {historyItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Logo Placeholder / Preview */}
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border">
                    <div className="text-2xl font-bold text-gray-600">
                      {item.businessName.charAt(0)}
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {item.businessName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                      <Badge variant="secondary">{item.style}</Badge>
                      <Badge variant="outline">{item.industry}</Badge>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {item.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.time}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onNewLogo}>
                    Regenerate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {historyItems.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No generation history
            </h3>
            <p className="text-gray-600 mb-4">
              Your logo generation history will appear here once you start
              creating.
            </p>
            <Button onClick={onNewLogo}>Create Your First Logo</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}