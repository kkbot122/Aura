"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogoGeneration } from "@/hooks/useLogoGeneration";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [style, setStyle] = useState("futuristic");
  const [industry, setIndustry] = useState("tech");
  
  const supabase = createClient();
  const router = useRouter();
  const { generateLogo, brand, logoPng, loading: generating, error, status, reset } = useLogoGeneration();

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleGenerateLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateLogo(businessName, style, industry, user?.id);
  };

  const handleNewLogo = () => {
    setShowGenerator(true);
    reset();
    setBusinessName("");
  };

  const handleCloseGenerator = () => {
    setShowGenerator(false);
    reset();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-notable text-gray-900 mb-4">
            Loading...
          </div>
          <div className="text-gray-600 font-dm-serif">
            Preparing your dashboard
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-gray-900 font-dm-serif">
            aura<span className="text-emerald-500">+</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-gray-700 font-dm-serif">
            Welcome, {user?.email?.split("@")[0]}
          </div>
          <button
            onClick={handleSignOut}
            className="px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors font-dm-serif"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-notable">
            Your Design Dashboard
          </h1>
          <p className="text-gray-600 font-dm-serif">
            Create and manage your AI-powered logos and brand assets
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-2 font-notable">
              {brand ? 1 : 0}
            </div>
            <div className="text-gray-600 font-dm-serif">Active Generation</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-2 font-notable">
              3
            </div>
            <div className="text-gray-600 font-dm-serif">Saved Projects</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-2 font-notable">
              12
            </div>
            <div className="text-gray-600 font-dm-serif">Design Elements</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button 
            onClick={handleNewLogo}
            className="bg-emerald-500 hover:bg-emerald-600 text-gray-900 rounded-2xl p-6 text-center transition-colors group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎨</div>
            <div className="font-dm-serif font-semibold">Create New Logo</div>
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center transition-colors group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📁</div>
            <div className="font-dm-serif font-semibold">My Projects</div>
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center transition-colors group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎯</div>
            <div className="font-dm-serif font-semibold">Templates</div>
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center transition-colors group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
            <div className="font-dm-serif font-semibold">Settings</div>
          </button>
        </div>

        {/* AI Logo Generator */}
        {showGenerator && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 font-notable">
                AI Logo Generator
              </h2>
              <button
                onClick={handleCloseGenerator}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateLogo} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-dm-serif">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-dm-serif"
                    placeholder="Enter business name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-dm-serif">
                    Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-dm-serif"
                  >
                    <option value="futuristic">Futuristic</option>
                    <option value="minimal">Minimal</option>
                    <option value="organic">Organic</option>
                    <option value="tech">Tech</option>
                    <option value="luxury">Luxury</option>
                    <option value="playful">Playful</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-dm-serif">
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-dm-serif"
                  >
                    <option value="tech">Technology</option>
                    <option value="fintech">Fintech</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="wellness">Wellness</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                    <option value="food">Food & Beverage</option>
                    <option value="creative">Creative Agency</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={generating || !businessName}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-gray-900 py-4 px-6 rounded-xl font-dm-serif font-semibold transition-colors disabled:cursor-not-allowed"
              >
                {generating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating... ({status})</span>
                  </div>
                ) : (
                  "Generate Logo & Brand Identity"
                )}
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 font-dm-serif">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Results Display */}
        {brand && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-notable">
              Your Generated Brand
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Brand Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 font-dm-serif">
                  Brand Identity
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 font-dm-serif">Tagline</h4>
                    <p className="text-gray-900 font-dm-serif text-lg">{brand.tagline}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 font-dm-serif">Description</h4>
                    <p className="text-gray-900 font-dm-serif leading-relaxed">{brand.brand_description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 font-dm-serif mb-3">Color Palette</h4>
                    <div className="flex space-x-3">
                      {brand.color_palette.map((color, index) => (
                        <div
                          key={index}
                          className="w-12 h-12 rounded-xl border border-gray-300 shadow-sm transition-transform hover:scale-110"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 font-dm-serif">Design Style</h4>
                    <p className="text-gray-900 font-dm-serif">{brand.design_style}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 font-dm-serif">Target Audience</h4>
                    <p className="text-gray-900 font-dm-serif">{brand.target_audience}</p>
                  </div>
                </div>
              </div>

              {/* Logo Preview */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 font-dm-serif">
                  Generated Logo
                </h3>
                
                {logoPng ? (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 flex items-center justify-center border border-gray-200">
                    <img 
                      src={logoPng} 
                      alt={`${brand.business_name} logo`}
                      className="max-w-full max-h-80 object-contain drop-shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 flex items-center justify-center min-h-64 border border-gray-200">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-gray-500 font-dm-serif">Generating your logo...</p>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => logoPng && window.open(logoPng, '_blank')}
                    disabled={!logoPng}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white py-3 px-6 rounded-xl font-dm-serif font-semibold transition-colors disabled:cursor-not-allowed"
                  >
                    Download PNG
                  </button>
                  <button
                    onClick={handleNewLogo}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-gray-900 py-3 px-6 rounded-xl font-dm-serif font-semibold transition-colors"
                  >
                    Create Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-notable">
            Recent Projects
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((project) => (
              <div
                key={project}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold font-notable">
                      L{project}
                    </span>
                  </div>
                  <div>
                    <div className="font-dm-serif font-semibold text-gray-900">
                      Brand Logo #{project}
                    </div>
                    <div className="text-sm text-gray-600 font-dm-serif">
                      Last edited 2 days ago
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-dm-serif text-sm transition-colors">
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}