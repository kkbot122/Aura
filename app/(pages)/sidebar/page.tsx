"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Home,
  History,
  Archive,
  Image as ImageIcon,
  Settings,
  HelpCircle,
  CreditCard,
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  showGenerator: boolean;
  brand: any;
  onNavigateHome: () => void;
  onNavigateHistory: () => void;
  onNavigateArchive: () => void;
  onNavigateSettings: () => void;
  onNewLogo: () => void;
}

export default function Sidebar({
  currentView,
  showGenerator,
  brand,
  onNavigateHome,
  onNavigateHistory,
  onNavigateArchive,
  onNavigateSettings,
  onNewLogo,
}: SidebarProps) {
  return (
    <aside className="hidden sm:flex w-64 flex-col border-r bg-white p-4 fixed left-0 top-0 bottom-0">
      {/* Logo Section */}
      <div className="flex items-center gap-2 px-2 py-4">
        <div
          className="text-3xl font-bold text-gray-900 font-dm-serif cursor-pointer"
          onClick={onNavigateHome}
        >
          <Image
            src="/Aura-logo.png"
            alt="Aura+ Logo"
            width={120}
            height={40}
            className="h-10 md:h-10 lg:h-15 w-auto"
          />
        </div>
      </div>

      {/* Navigation - This will scroll if content is too tall */}
      <nav className="flex-1 overflow-y-auto">
        <div className="mb-2">
          <span className="px-3 text-xs font-medium uppercase text-gray-500">
            General
          </span>
          <Button
            variant={
              currentView === "home" && !showGenerator && !brand
                ? "secondary"
                : "ghost"
            }
            className="w-full justify-start gap-2"
            onClick={onNavigateHome}
          >
            <Home className="h-4 w-4" /> Home
          </Button>
          <Button
            variant={
              currentView === "history" && !showGenerator && !brand
                ? "secondary"
                : "ghost"
            }
            className="w-full justify-start gap-2"
            onClick={onNavigateHistory}
          >
            <History className="h-4 w-4" /> History
          </Button>
          <Button
            variant={
              currentView === "archive" && !showGenerator && !brand
                ? "secondary"
                : "ghost"
            }
            className="w-full justify-start gap-2"
            onClick={onNavigateArchive}
          >
            <Archive className="h-4 w-4" /> Archive
          </Button>
        </div>

        <div className="mb-2">
          <span className="px-3 text-xs font-medium uppercase text-gray-500">
            AI Tools
          </span>
          <Button
            variant={showGenerator || brand ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={onNewLogo}
          >
            <ImageIcon className="h-4 w-4" /> Image Generator
          </Button>
        </div>

        <div className="mb-2">
          <span className="px-3 text-xs font-medium uppercase text-gray-500">
            Other
          </span>
          <Button
            variant={
              currentView === "settings" && !showGenerator && !brand
                ? "secondary"
                : "ghost"
            }
            className="w-full justify-start gap-2"
            onClick={onNavigateSettings}
          >
            <Settings className="h-4 w-4" /> Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <HelpCircle className="h-4 w-4" /> Help Center
          </Button>
        </div>
      </nav>

      {/* Upgrade Button - Fixed at bottom of sidebar */}
      <div className="mt-auto pt-4">
        <Button
          size="sm"
          className="w-full bg-violet-600 hover:bg-violet-700"
        >
          <CreditCard className="mr-2 h-4 w-4" /> Upgraded to Pro
        </Button>
      </div>
    </aside>
  );
}