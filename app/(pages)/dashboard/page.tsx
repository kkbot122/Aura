// app/dashboard/page.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

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
            Manage your logos, projects, and brand assets
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-2 font-notable">
              5
            </div>
            <div className="text-gray-600 font-dm-serif">Logos Created</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-2 font-notable">
              3
            </div>
            <div className="text-gray-600 font-dm-serif">Active Projects</div>
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
          <button className="bg-emerald-500 hover:bg-emerald-600 text-gray-900 rounded-2xl p-6 text-center transition-colors">
            <div className="text-2xl mb-2">🎨</div>
            <div className="font-dm-serif font-semibold">Create New Logo</div>
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center transition-colors">
            <div className="text-2xl mb-2">📁</div>
            <div className="font-dm-serif font-semibold">My Projects</div>
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center transition-colors">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-dm-serif font-semibold">Templates</div>
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center transition-colors">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="font-dm-serif font-semibold">Settings</div>
          </button>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-notable">
            Recent Projects
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((project) => (
              <div
                key={project}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
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
