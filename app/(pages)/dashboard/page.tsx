"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogoGeneration } from "@/hooks/useLogoGeneration";

// Import the separated components
import { DashboardHome } from "@/app/(pages)/home/page"; // <--- Imported here
import { DashboardHistory } from "@/app/(pages)/history/page"; // <--- Imported here
import { DashboardSettings } from "@/app/(pages)/settings/page"; // <--- Imported here
import { DashboardProfile } from "@/app/(pages)/profile/page"; // <--- Imported here
import { DashboardArchive } from "@/app/(pages)/archive/page"; // <--- Imported here

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  History,
  Archive,
  Image as ImageIcon,
  Settings,
  HelpCircle,
  CreditCard,
  User,
  Search,
  Bell,
  ChevronDown,
  Loader2,
  Download,
  X,
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // VIEW STATE
  // 'home', 'history', 'archive', 'settings', 'profile'
  const [currentView, setCurrentView] = useState("home");

  const [showGenerator, setShowGenerator] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [style, setStyle] = useState("");
  const [industry, setIndustry] = useState("");

  // NEW: State to track if the current logo has been saved to avoid duplicates
  const [savedLogoUrl, setSavedLogoUrl] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();
  const {
    generateLogo,
    brand,
    logoPng,
    loading: generating,
    error,
    status,
    reset,
  } = useLogoGeneration();

  // --- AUTH CHECK ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          router.push("/auth/signin");
          return;
        }

        if (!session) {
          router.push("/auth/signin");
          return;
        }

        setUser(session.user);
        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/auth/signin");
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/auth/signin");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  // --- AUTO-SAVE LOGIC ---
  // --- AUTO-SAVE LOGIC ---
  useEffect(() => {
    const saveToHistory = async () => {
      // Add detailed logging to debug
      console.log("🔄 Auto-save conditions check:", {
        hasLogoPng: !!logoPng,
        logoPngType: typeof logoPng,
        logoPngLength: logoPng?.length,
        logoPngPreview: logoPng?.substring(0, 50), // First 50 chars
        hasUser: !!user,
        userId: user?.id,
        alreadySaved: logoPng === savedLogoUrl,
        hasBrand: !!brand,
        status: status,
      });

      // Enhanced conditions: Only save when generation is complete and we have all data
      if (
        logoPng &&
        user &&
        status === "complete" &&
        logoPng !== savedLogoUrl &&
        brand
      ) {
        console.log(
          "✅ All conditions met, attempting to save logo to history..."
        );

        try {
          const logoData = {
            user_id: user.id,
            business_name: brand.business_name || businessName || "Untitled",
            style: style || brand.design_style || "General",
            industry: industry || "General",
            logo_url: logoPng,
            status: "completed",
            archived: false,
            created_at: new Date().toISOString(),
          };

          console.log("📦 Preparing to save logo data:", {
            business_name: logoData.business_name,
            style: logoData.style,
            industry: logoData.industry,
            logo_url_length: logoData.logo_url?.length,
            logo_url_type: typeof logoData.logo_url,
          });

          const { data, error } = await supabase
            .from("logos")
            .insert(logoData)
            .select();

          if (error) {
            console.error("❌ Supabase Insert Error:", error);
            console.error(
              "Error details:",
              error.details,
              error.hint,
              error.code
            );
            setSaveError(`Failed to save: ${error.message}`);
          } else {
            console.log("✅ Logo saved to history successfully!", data);
            setSavedLogoUrl(logoPng); // Mark as saved
          }
        } catch (err) {
          console.error("❌ Unexpected error saving logo:", err);
          setSaveError("Unexpected error occurred while saving.");
        }
      } else {
        console.log("⏸️ Auto-save skipped - conditions not met:", {
          reason: !logoPng
            ? "No logoPng"
            : !user
            ? "No user"
            : status !== "complete"
            ? `Status is ${status}`
            : logoPng === savedLogoUrl
            ? "Already saved"
            : !brand
            ? "No brand"
            : "Unknown",
        });
      }
    };

    saveToHistory();
  }, [
    logoPng,
    user,
    savedLogoUrl,
    brand,
    businessName,
    style,
    industry,
    status,
    supabase,
  ]);

  // --- HANDLERS ---

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleGenerateLogo = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Reset any previous generation state to prevent "stale" saves
    reset();
    setSavedLogoUrl(null);
    setSaveError(null);

    // 2. Trigger new generation
    await generateLogo(businessName, style, industry, user?.id);
  };

  const handleNewLogo = () => {
    setShowGenerator(true);
    reset();
    setSavedLogoUrl(null);
    setSaveError(null);
    setBusinessName("");
  };

  const handleCloseGenerator = () => {
    setShowGenerator(false);
    reset();
    setSavedLogoUrl(null);
  };

  // Navigation Helpers
  const navigateToHome = () => {
    setShowGenerator(false);
    reset();
    setSavedLogoUrl(null);
    setCurrentView("home");
  };

  const navigateToHistory = () => {
    setShowGenerator(false);
    reset();
    setSavedLogoUrl(null);
    setCurrentView("history");
  };

  const navigateToArchive = () => {
    setShowGenerator(false);
    reset();
    setSavedLogoUrl(null);
    setCurrentView("archive");
  };

  const navigateToSettings = () => {
    setShowGenerator(false);
    reset();
    setSavedLogoUrl(null);
    setCurrentView("settings");
  };

  const navigateToProfile = () => {
    setShowGenerator(false);
    reset();
    setSavedLogoUrl(null);
    setCurrentView("profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <div className="text-2xl font-semibold text-gray-900 mb-2">
            Loading...
          </div>
          <div className="text-gray-600">Preparing your dashboard</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-100/40">
      {/* === Sidebar === */}
      <aside className="hidden w-64 flex-col border-r bg-white p-4 sm:flex">
        <div className="flex items-center gap-2 px-2 py-4">
          <div
            className="text-3xl font-bold text-gray-900 font-dm-serif cursor-pointer"
            onClick={navigateToHome}
          >
            aura<span className="text-emerald-500">+</span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
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
              onClick={navigateToHome}
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
              onClick={navigateToHistory}
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
              onClick={navigateToArchive}
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
              onClick={handleNewLogo}
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
              onClick={navigateToSettings}
            >
              <Settings className="h-4 w-4" /> Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <HelpCircle className="h-4 w-4" /> Help Center
            </Button>
          </div>
        </nav>

        <div className="mt-auto">
          <Button
            size="sm"
            className="mt-4 w-full bg-violet-600 hover:bg-violet-700"
          >
            <CreditCard className="mr-2 h-4 w-4" /> Upgraded to Pro
          </Button>
        </div>
      </aside>

      {/* === Main Content Area === */}
      <div className="flex flex-1 flex-col">
        {/* === Header === */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search..."
                className="w-full max-w-sm rounded-full bg-gray-100 pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              What's New? ✨
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              English <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">
                    {user?.email?.split("@")[0] || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={navigateToSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={navigateToProfile}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-500"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* === Scrolling Content === */}
        <main className="flex-1 overflow-auto p-6">
          {/* CASE 1: Navigation Views */}
          {!showGenerator && !brand && (
            <>
              {currentView === "home" && (
                <DashboardHome onNewLogo={handleNewLogo} />
              )}
              {currentView === "history" && (
                <DashboardHistory onNewLogo={handleNewLogo} />
              )}
              {currentView === "archive" && <DashboardArchive />}
              {currentView === "settings" && <DashboardSettings />}
              {currentView === "profile" && <DashboardProfile user={user} />}
            </>
          )}

          {/* CASE 2: Show Generator Form */}
          {showGenerator && (
            <Card className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  AI Logo Generator
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseGenerator}
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerateLogo} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                      </label>
                      <Input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g., 'Aura+'"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Style
                      </label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="futuristic">Futuristic</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="organic">Organic</SelectItem>
                          <SelectItem value="tech">Tech</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                          <SelectItem value="playful">Playful</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">Technology</SelectItem>
                          <SelectItem value="fintech">Fintech</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="wellness">Wellness</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="food">Food & Beverage</SelectItem>
                          <SelectItem value="creative">
                            Creative Agency
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={generating || !businessName}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-base"
                    size="lg"
                  >
                    {generating ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Generating... ({status})</span>
                      </div>
                    ) : (
                      "Generate Logo & Brand Identity"
                    )}
                  </Button>
                </form>

                {error && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* CASE 3: Show Results */}
          {brand && (
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Generated Brand
              </h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Brand Details Card */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Brand Identity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-700">Tagline</h4>
                      <p className="text-lg text-gray-900">{brand.tagline}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Description</h4>
                      <p className="text-gray-900 leading-relaxed">
                        {brand.brand_description}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">
                        Color Palette
                      </h4>
                      <div className="flex space-x-3">
                        {brand.color_palette.map(
                          (color: string, index: number) => (
                            <div
                              key={index}
                              className="w-12 h-12 rounded-xl border border-gray-300 shadow-sm transition-transform hover:scale-110 cursor-pointer"
                              style={{ backgroundColor: color }}
                              title={color}
                              onClick={() => {
                                navigator.clipboard.writeText(color);
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700">
                          Design Style
                        </h4>
                        <p className="text-gray-900">{brand.design_style}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">
                          Target Audience
                        </h4>
                        <p className="text-gray-900">{brand.target_audience}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Logo Preview Card */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Generated Logo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {logoPng ? (
                      <div className="rounded-lg bg-gray-100 p-6 flex items-center justify-center border">
                        <img
                          src={logoPng}
                          alt={`${brand.business_name} logo`}
                          className="max-w-full max-h-64 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="rounded-lg bg-gray-100 p-6 flex items-center justify-center min-h-64 border">
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-gray-500 mx-auto mb-3" />
                          <p className="text-gray-500">Generating logo...</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex-col space-y-3">
                    <Button
                      onClick={() => logoPng && window.open(logoPng, "_blank")}
                      disabled={!logoPng}
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PNG
                    </Button>
                    <Button
                      onClick={handleNewLogo}
                      variant="outline"
                      className="w-full"
                    >
                      Create Another
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}

          {/* Optional Error Toast/Display */}
          {saveError && (
            <div
              className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Save Error: </strong>
              <span className="block sm:inline">{saveError}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <X
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => setSaveError(null)}
                />
              </span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
