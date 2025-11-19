import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-white from-gray-50 to-white"
      style={{ fontFamily: "var(--font-playfair)" }}
    >
      {/* Navigation */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <Image
            src="/Aura-logo.png" // path from public folder
            alt="Aura+ Logo"
            width={120} // adjust as needed
            height={40} // adjust as needed
            className="h-10 md:h-10 lg:h-15 w-auto" // or use your own sizing
          />
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="explore"
            className="text-gray-700 hover:text-gray-900 transition-colors font-dm-serif"
          >
            Explore
          </Link>
          <Link
            href="pricing"
            className="text-gray-700 hover:text-gray-900 transition-colors font-dm-serif"
          >
            Pricing
          </Link>
          <Link
            href="about"
            className="text-gray-700 hover:text-gray-900 transition-colors font-dm-serif"
          >
            About us
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/auth/signin"
            className="px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors font-dm-serif"
          >
            Log In
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-500 text-gray-900 rounded-full font-dm-serif font-medium transition-all shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="px-6 pt-20 pb-32 max-w-6xl mx-auto text-center hero-bg w-full min-h-screen -mx-0">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight mb-6 font-playfair">
          AI-Powered Logos to
          <br />
          Build Your Brand
        </h1>

        <p
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-playfair"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          From startups to enterprises, use AI that captures your brand's vibe!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-dm-serif font-medium text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Start for free
          </button>
        </div>

        {/* Demo Preview Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-700">
              <div className="text-white font-medium font-dm-serif">
                Brand Studio
              </div>
              <button className="text-gray-400 hover:text-white text-sm flex items-center gap-2 font-dm-serif">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Share
              </button>
            </div>

            <div className="aspect-video bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>

              {/* Logo showcase mockup */}
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-white/10 backdrop-blur-lg rounded-3xl mb-6 shadow-2xl">
                  <div className="text-6xl font-bold text-white font-notable">
                    A
                  </div>
                </div>
                <div className="text-white text-2xl font-bold mb-2 font-dm-serif">
                  Your Brand
                </div>
                <div className="text-emerald-300 text-sm font-dm-serif-italic">
                  Powered by AI
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-400/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 font-notable">
            Everything you need to build your brand
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-emerald-400 rounded-xl mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 font-dm-serif">
                Instant Generation
              </h3>
              <p className="text-gray-700 font-dm-serif">
                Create professional logos in seconds with our advanced AI
                technology
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-400 rounded-xl mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 font-dm-serif">
                Full Customization
              </h3>
              <p className="text-gray-700 font-dm-serif">
                Fine-tune colors, fonts, and layouts to match your vision
                perfectly
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-400 rounded-xl mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 font-dm-serif">
                Brand Assets
              </h3>
              <p className="text-gray-700 font-dm-serif">
                Get a complete brand kit with logos, color palettes, and
                guidelines
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-black text-sm sm:text-base">
            © 2025 Aura. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
