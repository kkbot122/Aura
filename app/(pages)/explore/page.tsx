import Link from "next/link";
import Image from "next/image";

export default function Explore() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-gray-900 font-dm-serif">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 transition-colors font-dm-serif"
            >
              <Image
                src="/Aura-logo.png" // path from public folder
                alt="Aura+ Logo"
                width={120} // adjust as needed
                height={40} // adjust as needed
                className="h-10 md:h-10 lg:h-15 w-auto" // or use your own sizing
              />
            </Link>
          </div>
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
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" style={{ fontFamily: 'var(--font-playfair)' }}>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-notable">
            Explore Possibilities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-dm-serif">
            Discover thousands of logo templates, AI-generated designs, and
            brand inspiration for every industry and style
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 text-black" style={{ fontFamily: 'var(--font-playfair)' }}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="Search logos, industries, styles..."
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-dm-serif"
              />
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-3 border border-gray-300 rounded-xl font-dm-serif">
                <option>All Industries</option>
                <option>Technology</option>
                <option>Food & Beverage</option>
                <option>Fashion</option>
                <option>Health & Wellness</option>
                <option>Creative Arts</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-xl font-dm-serif">
                <option>All Styles</option>
                <option>Modern</option>
                <option>Vintage</option>
                <option>Minimal</option>
                <option>Luxury</option>
                <option>Playful</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <section className="mb-20" style={{ fontFamily: 'var(--font-playfair)' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-notable">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "Tech Startups",
                count: "1.2K",
                color: "from-blue-500 to-cyan-500",
              },
              {
                name: "Restaurants",
                count: "890",
                color: "from-orange-500 to-red-500",
              },
              {
                name: "Fashion Brands",
                count: "756",
                color: "from-pink-500 to-purple-500",
              },
              {
                name: "Health & Fitness",
                count: "634",
                color: "from-green-500 to-emerald-500",
              },
              {
                name: "Creative Agencies",
                count: "542",
                color: "from-purple-500 to-indigo-500",
              },
              {
                name: "Real Estate",
                count: "487",
                color: "from-amber-500 to-yellow-500",
              },
              {
                name: "Beauty & Spa",
                count: "421",
                color: "from-rose-500 to-pink-500",
              },
              {
                name: "Education",
                count: "398",
                color: "from-indigo-500 to-blue-500",
              },
            ].map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div
                  className={`aspect-square rounded-2xl bg-gradient-to-br ${category.color} mb-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                >
                  <div className="text-white text-2xl font-bold font-notable">
                    {category.name.split(" ")[0].charAt(0)}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-dm-serif font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-dm-serif">
                    {category.count} designs
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Templates */}
        <section className="mb-20" style={{ fontFamily: 'var(--font-playfair)' }}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-notable">
              Trending Templates
            </h2>
            <button className="text-emerald-600 hover:text-emerald-700 font-dm-serif font-medium">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800 font-notable mb-2">
                      LOGO
                    </div>
                    <div className="text-sm text-gray-600 font-dm-serif">
                      Template #{item}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-dm-serif font-semibold text-gray-900 text-lg">
                      Modern Tech #{item}
                    </h3>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-dm-serif">
                      Popular
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 font-dm-serif">
                    Clean and professional design perfect for tech companies
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500 font-dm-serif">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      4.8
                    </div>
                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-dm-serif text-sm transition-colors">
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI-Generated Showcase */}
        <section className="mb-20" style={{ fontFamily: 'var(--font-playfair)' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 font-notable">
            AI-Powered Creations
          </h2>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 font-notable">
                  Generate Your Unique Logo
                </h3>
                <p className="text-gray-300 mb-6 font-dm-serif">
                  Our AI understands your brand's personality and creates custom
                  logos that truly represent your vision. No templates, just
                  pure creativity.
                </p>
                <div className="space-y-3">
                  {[
                    "Describe your brand in words",
                    "Choose your preferred style",
                    "AI generates multiple options",
                    "Customize and download",
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center font-dm-serif"
                    >
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                        {index + 1}
                      </div>
                      {step}
                    </div>
                  ))}
                </div>
                <button className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-gray-900 px-6 py-3 rounded-lg font-dm-serif font-semibold transition-colors">
                  Try AI Generator
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4 aspect-square flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold font-notable mb-1">
                        BRAND
                      </div>
                      <div className="text-xs text-emerald-300 font-dm-serif">
                        AI Generated
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Style Guides */}
        
      </div>
      <footer className="py-6 px-4 sm:px-6 lg:px-8 border-t border-border" style={{ fontFamily: 'var(--font-playfair)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-black text-sm sm:text-base">
            © 2025 Aura. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
