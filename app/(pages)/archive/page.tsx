"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Archive, Trash2, ArchiveRestore, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for archived items
const archivedItems = [
  {
    id: 1,
    businessName: "OldTech Solutions",
    style: "Tech",
    industry: "Technology",
    archivedDate: "2024-01-10",
    logoUrl: "/api/placeholder/80/80",
  },
  {
    id: 2,
    businessName: "Vintage Cafe",
    style: "Organic",
    industry: "Food & Beverage",
    archivedDate: "2024-01-05",
    logoUrl: "/api/placeholder/80/80",
  },
];

export function DashboardArchive() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">Archive</h1>
        <p className="text-gray-600">Manage your archived logos and projects</p>
      </div>

      {/* Archive Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {archivedItems.length}
              </div>
              <div className="text-gray-600">Archived Items</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">2.3GB</div>
              <div className="text-gray-600">Storage Used</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">30</div>
              <div className="text-gray-600">Days Kept</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Auto</div>
              <div className="text-gray-600">Cleanup</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input placeholder="Search archive..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Trash2 className="mr-2 h-4 w-4" />
              Empty Archive
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Archived Items */}
      <div className="space-y-4">
        {archivedItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center opacity-60 border">
                    <Archive className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-600">
                      {item.businessName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
                      <Badge variant="outline">{item.style}</Badge>
                      <Badge variant="outline">{item.industry}</Badge>
                      <span className="text-gray-300">|</span>
                      <div>Archived on {item.archivedDate}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArchiveRestore className="mr-2 h-4 w-4" />
                    Restore
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {archivedItems.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <div className="text-gray-400 mb-4">
              <Archive className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Archive is empty</h3>
            <p className="text-gray-600 mb-4">
              Archived logos and projects will appear here when you move them to
              archive.
            </p>
            <Button variant="outline">
              <Archive className="mr-2 h-4 w-4" />
              Learn about archiving
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}