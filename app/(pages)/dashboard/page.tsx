"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogoGeneration } from "@/hooks/useLogoGeneration";
import Image from "next/image";

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
  CardDescription,
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
  FileText,
  Shirt,
  Smartphone,
  Globe,
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
    logoVariations,
    loading: generating,
    error,
    status,
    reset,
  } = useLogoGeneration();
  const [description, setDescription] = useState("");
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [mockups, setMockups] = useState<string[]>([]);
  const [generatingMockups, setGeneratingMockups] = useState(false);

  const handleGeneratePDF = async () => {
    if (!brand || !logoPng) return;

    setGeneratingPdf(true);
    try {
      // Import PDFGenerator dynamically to avoid SSR issues
      const { PDFGenerator } = await import("@/lib/pdf-generator");

      // Generate PDF directly in the client
      const pdfBlob = await PDFGenerator.generateBrandBook(brand, logoPng);

      // Create URL for the blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);

      console.log("PDF generated successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      // Fallback: Create a simple text-based PDF
      await generateFallbackPDF();
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Fallback PDF generation
  const generateFallbackPDF = async () => {
    try {
      const { PDFGenerator } = await import("@/lib/pdf-generator");
      // Simple text-based PDF without images
      const pdfBlob = await PDFGenerator.generateBrandBook(brand, "");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    } catch (fallbackError) {
      console.error("Fallback PDF generation also failed:", fallbackError);
      // You can show a toast notification here
    }
  };

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${brand.business_name.replace(
        /\s+/g,
        "_"
      )}_Brand_Book.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
    }
  };

  // In your dashboard, update the mockup generation to handle client-side only
  const handleGenerateMockups = async () => {
    if (!brand || !logoPng) return;

    setGeneratingMockups(true);
    try {
      // Import dynamically to avoid SSR issues
      const { MockupGenerator } = await import("@/lib/mockup-generator");

      const colors = brand.color_palette?.map((color: any) => color.hex) || [
        "#3b82f6",
      ];
      const mockupUrls = await MockupGenerator.generateProductMockups({
        logoUrl: logoPng,
        businessName: brand.business_name,
        colors,
      });

      setMockups(mockupUrls);
    } catch (error) {
      console.error("Mockup generation error:", error);
    } finally {
      setGeneratingMockups(false);
    }
  };
  const handleGenerateCompleteBrandBook = async () => {
    if (!brand || !logoPng) {
      console.error("Missing brand data or logo");
      return;
    }

    setGeneratingPdf(true);
    try {
      // Generate mockups first
      const colors = brand.color_palette?.map((color: any) => color.hex) || [
        "#3b82f6",
      ];
      const { MockupGenerator } = await import("@/lib/mockup-generator");
      const mockupUrls = await MockupGenerator.generateProductMockups({
        logoUrl: logoPng,
        businessName: brand.business_name || "Your Business",
        colors,
      });

      // Generate PDF with premium generator
      const { PremiumPDFGenerator } = await import("@/lib/pdf-generator");
      const pdfBlob = await PremiumPDFGenerator.generateBrandBook({
        brand: brand,
        primaryLogo: logoPng,
        logoVariations: logoVariations || {},
        mockups: mockupUrls,
      });

      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
      setMockups(mockupUrls);

      console.log("Premium brand book generated successfully");
    } catch (error) {
      console.error("Premium brand book generation error:", error);
    } finally {
      setGeneratingPdf(false);
    }
  };
  // const handleDownloadPDF = () => {
  //   if (pdfUrl) {
  //     const link = document.createElement("a");
  //     link.href = pdfUrl;
  //     link.download = `${brand.business_name.replace(
  //       /\s+/g,
  //       "_"
  //     )}_Brand_Book.pdf`;
  //     link.click();
  //   }
  // };

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

    // Reset any previous generation state
    reset();
    setSavedLogoUrl(null);
    setSaveError(null);

    // Trigger new generation with description
    await generateLogo(businessName, style, industry, description, user?.id);
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
            <Image
              src="/Aura-logo.png" // path from public folder
              alt="Aura+ Logo"
              width={120} // adjust as needed
              height={40} // adjust as needed
              className="h-10 md:h-10 lg:h-15 w-auto" // or use your own sizing
            />
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
                  AI Brand Identity Generator
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
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Business Name *
                      </label>
                      <Input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g., 'Aura+'"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Style *
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
                          <SelectItem value="vintage">Vintage</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Industry *
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
                          <SelectItem value="fashion">Fashion</SelectItem>
                          <SelectItem value="realestate">
                            Real Estate
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* NEW: Description Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Business Description *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your business, target audience, values, and any specific requirements for your brand identity..."
                      className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Be specific about your brand's personality, values, and
                      target audience for better results.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={generating || !businessName || !description}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-base"
                    size="lg"
                  >
                    {generating ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>
                          Generating Complete Brand Identity... ({status})
                        </span>
                      </div>
                    ) : (
                      "Generate Complete Brand Identity"
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Your Complete Brand Identity: {brand.business_name}
              </h2>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Enhanced Brand Details Card */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Brand Identity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Tagline */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Tagline
                      </h4>
                      <p className="text-lg text-gray-900 font-semibold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                        {brand.tagline}
                      </p>
                    </div>

                    {/* Brand Description */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Brand Description
                      </h4>
                      <p className="text-gray-900 leading-relaxed">
                        {brand.brand_description}
                      </p>
                    </div>

                    {/* Mission Statement */}
                    {brand.mission_statement && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Mission Statement
                        </h4>
                        <p className="text-gray-900 italic border-l-4 border-emerald-500 pl-4 py-2">
                          {brand.mission_statement}
                        </p>
                      </div>
                    )}

                    {/* Core Values */}
                    {brand.core_values && Array.isArray(brand.core_values) && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">
                          Core Values
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {brand.core_values.map(
                            (value: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-medium"
                              >
                                {value}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Color Palette */}
                    {brand.color_palette &&
                      Array.isArray(brand.color_palette) && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-3">
                            Color Palette
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {brand.color_palette.map(
                              (color: any, index: number) => (
                                <div key={index} className="text-center">
                                  <div
                                    className="w-16 h-16 rounded-xl border border-gray-300 shadow-sm transition-all hover:scale-110 cursor-pointer mb-2 mx-auto"
                                    style={{ backgroundColor: color.hex }}
                                    title={`${color.name}: ${color.hex}\n${color.usage}`}
                                    onClick={() => {
                                      navigator.clipboard.writeText(color.hex);
                                      // You can add a toast notification here
                                    }}
                                  />
                                  <p className="text-sm font-medium text-gray-900">
                                    {color.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {color.hex}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Design Style */}
                    {brand.design_style && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Design Style
                        </h4>
                        <p className="text-gray-900">{brand.design_style}</p>
                      </div>
                    )}

                    {/* Typography - Handle object properly */}
                    {brand.typography &&
                      typeof brand.typography === "object" && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-3">
                            Typography
                          </h4>
                          <div className="space-y-2">
                            {brand.typography.primary && (
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Primary: {brand.typography.primary}
                                </p>
                              </div>
                            )}
                            {brand.typography.secondary && (
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Secondary: {brand.typography.secondary}
                                </p>
                              </div>
                            )}
                            {brand.typography.accent && (
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Accent: {brand.typography.accent}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Target Audience - Handle object properly */}
                    {brand.target_audience &&
                      typeof brand.target_audience === "object" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {brand.target_audience.primary && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">
                                Primary Audience
                              </h4>
                              <p className="text-gray-900 text-sm">
                                {brand.target_audience.primary}
                              </p>
                            </div>
                          )}
                          {brand.target_audience.secondary && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">
                                Secondary Audience
                              </h4>
                              <p className="text-gray-900 text-sm">
                                {brand.target_audience.secondary}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                    {/* Brand Personality - Handle object properly */}
                    {brand.brand_personality &&
                      typeof brand.brand_personality === "object" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {brand.brand_personality.traits &&
                            Array.isArray(brand.brand_personality.traits) && (
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">
                                  Brand Personality
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                  {brand.brand_personality.traits.map(
                                    (trait: string, index: number) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                      >
                                        {trait}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          {brand.brand_personality.tone_of_voice && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">
                                Tone of Voice
                              </h4>
                              <p className="text-gray-900 text-sm">
                                {brand.brand_personality.tone_of_voice}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                    {/* Logo Direction - Handle object properly */}
                    {brand.logo_direction &&
                      typeof brand.logo_direction === "object" && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-3">
                            Logo Direction
                          </h4>
                          <div className="space-y-3">
                            {brand.logo_direction.concept && (
                              <div>
                                <p className="font-semibold text-gray-900 mb-1">
                                  Concept
                                </p>
                                <p className="text-gray-900 text-sm">
                                  {brand.logo_direction.concept}
                                </p>
                              </div>
                            )}
                            {brand.logo_direction.symbolism && (
                              <div>
                                <p className="font-semibold text-gray-900 mb-1">
                                  Symbolism
                                </p>
                                <p className="text-gray-900 text-sm">
                                  {brand.logo_direction.symbolism}
                                </p>
                              </div>
                            )}
                            {brand.logo_direction.style_notes && (
                              <div>
                                <p className="font-semibold text-gray-900 mb-1">
                                  Style Notes
                                </p>
                                <p className="text-gray-900 text-sm">
                                  {brand.logo_direction.style_notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
          {/* Add this after your brand identity cards */}
          {brand && logoPng && (
            <Card>
              <CardHeader>
                <CardTitle>Export & Mockups</CardTitle>
                <CardDescription>
                  Download your brand book and see your logo in action
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* PDF Generation */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <h4 className="font-semibold">Brand Book PDF</h4>
                      <p className="text-sm text-gray-600">
                        Complete brand guidelines document
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!pdfUrl ? (
                      <Button
                        onClick={handleGenerateCompleteBrandBook}
                        disabled={generatingPdf}
                        variant="outline"
                      >
                        {generatingPdf ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate PDF
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button onClick={handleDownloadPDF} variant="default">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    )}
                  </div>
                </div>

                {/* Mockups Generation */}
                {/* <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shirt className="h-8 w-8 text-green-500" />
                    <div>
                      <h4 className="font-semibold">Product Mockups</h4>
                      <p className="text-sm text-gray-600">
                        See your logo on various products
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleGenerateMockups}
                    disabled={generatingMockups}
                    variant="outline"
                  >
                    {generatingMockups ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Shirt className="mr-2 h-4 w-4" />
                        Generate Mockups
                      </>
                    )}
                  </Button>
                </div> */}

                {/* Mockups Display */}
                {/* {mockups.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-4">Product Mockups</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {mockups.map((mockup, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 text-center"
                        >
                          <img
                            src={mockup}
                            alt={`Mockup ${index + 1}`}
                            className="w-full h-32 object-contain mb-2"
                          />
                          <p className="text-sm text-gray-600">
                            {
                              [
                                "Business Card",
                                "T-Shirt",
                                "Website",
                                "Mobile App",
                                "Packaging",
                                "Stationery",
                              ][index]
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </CardContent>
            </Card>
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
