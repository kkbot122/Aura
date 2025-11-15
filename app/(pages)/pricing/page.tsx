import Link from "next/link";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-gray-900 font-dm-serif">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 transition-colors font-dm-serif"
            >
              aura<span className="text-emerald-500">+</span>
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
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-notable">
            Simple Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-dm-serif">
            Choose the perfect plan for your brand. Start free and upgrade when
            you're ready to unlock premium features and downloads.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-2xl p-1 inline-flex">
            <button className="px-6 py-3 rounded-xl bg-white shadow-sm text-gray-900 font-dm-serif font-medium">
              Monthly
            </button>
            <button className="px-6 py-3 rounded-xl text-gray-600 hover:text-gray-900 font-dm-serif">
              Yearly <span className="text-emerald-600 ml-1">(Save 30%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {/* Free Plan */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-notable">
                Starter
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900 font-notable">
                  $0
                </span>
                <span className="text-gray-600 font-dm-serif">/forever</span>
              </div>
              <p className="text-gray-600 font-dm-serif">
                Perfect for trying out our platform
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                "3 free logo generations",
                "Basic templates access",
                "Standard PNG downloads",
                "Watermark on exports",
                "Community support",
              ].map((feature, index) => (
                <div key={index} className="text-black flex items-center font-dm-serif">
                  <svg
                    className="w-5 h-5 text-emerald-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>

            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-xl font-dm-serif font-medium transition-colors">
              Get Started Free
            </button>
          </div>

          {/* Pro Plan - Featured */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-2xl transform scale-105 relative p-8">
            <div className="absolute top-4 right-4">
              <span className="bg-white text-emerald-600 px-3 py-1 rounded-full text-sm font-dm-serif font-medium">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4 font-notable">
                Pro Creator
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white font-notable">
                  $29
                </span>
                <span className="text-emerald-100 font-dm-serif">/month</span>
              </div>
              <p className="text-emerald-100 font-dm-serif">
                Everything you need for professional branding
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                "Unlimited logo generations",
                "Premium templates library",
                "High-resolution PNG & SVG",
                "No watermark",
                "Custom color palettes",
                "Font pairing suggestions",
                "Priority support",
                "Brand style guide",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center text-white font-dm-serif"
                >
                  <svg
                    className="w-5 h-5 text-white mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>

            <button className="w-full bg-white hover:bg-gray-100 text-emerald-600 py-4 rounded-xl font-dm-serif font-semibold transition-colors">
              Start Pro Trial
            </button>
          </div>

          {/* Agency Plan */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-notable">
                Agency
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900 font-notable">
                  $79
                </span>
                <span className="text-gray-600 font-dm-serif">/month</span>
              </div>
              <p className="text-gray-600 font-dm-serif">
                For design agencies and teams
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                "Everything in Pro, plus:",
                "5 team member seats",
                "Client presentation tools",
                "Brand asset management",
                "Custom template creation",
                "White-label exports",
                "Dedicated account manager",
                "API access",
              ].map((feature, index) => (
                <div key={index} className="text-black flex items-center font-dm-serif">
                  <svg
                    className="w-5 h-5 text-emerald-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>

            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-dm-serif font-medium transition-colors">
              Contact Sales
            </button>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 font-notable">
            Compare Features
          </h2>
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-6 font-dm-serif font-semibold text-gray-900">
                    Features
                  </th>
                  <th className="text-center p-6 font-dm-serif font-semibold text-gray-900">
                    Starter
                  </th>
                  <th className="text-center p-6 font-dm-serif font-semibold text-emerald-600">
                    Pro
                  </th>
                  <th className="text-center p-6 font-dm-serif font-semibold text-gray-900">
                    Agency
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Logo Generations", "3/month", "Unlimited", "Unlimited"],
                  ["Templates Access", "Basic", "Premium", "Premium + Custom"],
                  [
                    "Download Formats",
                    "PNG",
                    "PNG, SVG, PDF",
                    "All + White-label",
                  ],
                  ["Resolution", "Standard", "High-res", "Print-ready"],
                  ["Watermark", "Yes", "No", "No"],
                  ["Brand Assets", "Limited", "Full kit", "Advanced kit"],
                  ["Team Members", "1", "1", "5+"],
                  ["Support", "Community", "Priority", "Dedicated"],
                  ["API Access", "No", "No", "Yes"],
                ].map(([feature, starter, pro, agency], index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="p-6 font-dm-serif text-gray-700">
                      {feature}
                    </td>
                    <td className="p-6 text-center font-dm-serif text-gray-600">
                      {starter}
                    </td>
                    <td className="p-6 text-center font-dm-serif text-emerald-600 font-semibold">
                      {pro}
                    </td>
                    <td className="p-6 text-center font-dm-serif text-gray-600">
                      {agency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 font-notable">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "Can I cancel my subscription anytime?",
                answer:
                  "Yes, you can cancel your subscription at any time. You'll continue to have access to paid features until the end of your billing period.",
              },
              {
                question: "Do you offer discounts for students or nonprofits?",
                answer:
                  "Yes! We offer 50% off for students and verified nonprofits. Contact our support team with proof of status to get your discount.",
              },
              {
                question: "What file formats can I download my logos in?",
                answer:
                  "Starter plan includes PNG, Pro includes PNG, SVG, and PDF, while Agency includes all formats plus white-label options and print-ready files.",
              },
              {
                question: "Can I use the logos for commercial purposes?",
                answer:
                  "Absolutely! All logos you create are 100% yours. You have full commercial rights to use them for your business, clients, or personal projects.",
              },
              {
                question: "How does the AI logo generator work?",
                answer:
                  "Our AI analyzes your brand description, industry, and style preferences to generate unique logo concepts. You can then customize every aspect of the design.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h3 className="font-dm-serif font-semibold text-gray-900 text-lg mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 font-dm-serif">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mt-16">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4 font-notable">
              Ready to Build Your Brand?
            </h2>
            <p className="text-gray-300 mb-8 text-lg font-dm-serif max-w-2xl mx-auto">
              Join thousands of businesses that have created their perfect logo
              with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-gray-900 px-8 py-4 rounded-xl font-dm-serif font-semibold transition-colors">
                Start Free Trial
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-dm-serif font-medium transition-colors backdrop-blur-sm">
                Schedule a Demo
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
