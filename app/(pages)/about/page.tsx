import Link from "next/link";

export default function About() {
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
          <button className="px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors font-dm-serif">
            Log In
          </button>
          <button className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-500 text-gray-900 rounded-full font-dm-serif font-medium transition-all shadow-sm hover:shadow-md">
            Get Started
          </button>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-notable">
              Our Story
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-dm-serif">
              We're on a mission to democratize great design and help every business 
              build a brand they're proud of.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
            {[
              { number: '50K+', label: 'Logos Created' },
              { number: '120+', label: 'Countries' },
              { number: '98%', label: 'Satisfaction Rate' },
              { number: '24/7', label: 'AI Innovation' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-notable">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-dm-serif">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl"></div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 font-notable">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 font-dm-serif">
                In a world where first impressions matter more than ever, we believe every 
                business deserves access to professional branding—regardless of their budget 
                or design experience.
              </p>
              <p className="text-lg text-gray-600 mb-8 font-dm-serif">
                Aura+ was born from the frustration of seeing great ideas struggle because 
                they couldn't afford expensive design agencies. We're combining cutting-edge 
                AI with human-centered design to make professional branding accessible to all.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-dm-serif font-semibold text-gray-900">Innovation First</div>
                  <div className="text-sm text-gray-600 font-dm-serif">Always pushing boundaries</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 font-notable mb-1">A+</div>
                    <div className="text-xs text-gray-600 font-dm-serif">Design</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-notable">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-dm-serif">
              Passionate designers, developers, and AI experts working together to 
              revolutionize brand creation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Chen',
                role: 'CEO & Founder',
                bio: 'Former design lead at major tech company, passionate about democratizing design.',
                expertise: ['AI Design', 'Brand Strategy', 'Product Vision']
              },
              {
                name: 'Marcus Rodriguez',
                role: 'Head of AI',
                bio: 'PhD in Machine Learning, focused on creative AI applications.',
                expertise: ['Machine Learning', 'Neural Networks', 'Creative AI']
              },
              {
                name: 'Elena Petrova',
                role: 'Design Director',
                bio: 'Award-winning designer with 10+ years in brand identity.',
                expertise: ['Brand Design', 'Typography', 'User Experience']
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold font-notable">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-notable">{member.name}</h3>
                <div className="text-emerald-600 font-dm-serif font-medium mb-4">{member.role}</div>
                <p className="text-gray-600 mb-6 font-dm-serif">{member.bio}</p>
                <div className="space-y-2">
                  {member.expertise.map((skill, skillIndex) => (
                    <span key={skillIndex} className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-dm-serif mr-2 mb-2">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16 font-notable">
            Our Values
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🚀',
                title: 'Innovation',
                description: 'We constantly push the boundaries of what AI can achieve in design, always exploring new ways to create better results.'
              },
              {
                icon: '🎯',
                title: 'Accessibility',
                description: 'Great design should be available to everyone, regardless of budget or technical skills.'
              },
              {
                icon: '❤️',
                title: 'Quality',
                description: 'We never compromise on quality. Every logo we help create meets professional standards.'
              },
              {
                icon: '🤝',
                title: 'Collaboration',
                description: 'We believe the best results come from combining AI capabilities with human creativity and feedback.'
              },
              {
                icon: '🌱',
                title: 'Growth',
                description: 'We’re committed to helping businesses grow by providing tools that scale with their needs.'
              },
              {
                icon: '⚡',
                title: 'Speed',
                description: 'In today’s fast-paced world, we deliver professional results in minutes, not weeks.'
              }
            ].map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-notable">{value.title}</h3>
                <p className="text-gray-600 font-dm-serif">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16 font-notable">
            Our Journey
          </h2>
          
          <div className="space-y-12">
            {[
              {
                year: '2022',
                title: 'The Beginning',
                description: 'Founded with a vision to make professional design accessible to all businesses.'
              },
              {
                year: '2023',
                title: 'AI Integration',
                description: 'Integrated advanced machine learning models for intelligent logo generation.'
              },
              {
                year: '2024',
                title: 'Global Launch',
                description: 'Expanded to serve customers in over 120 countries worldwide.'
              },
              {
                year: 'Future',
                title: 'What\'s Next',
                description: 'Developing full brand identity suites and advanced customization tools.'
              }
            ].map((milestone, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold font-notable mr-6">
                  {milestone.year}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-notable">{milestone.title}</h3>
                  <p className="text-gray-600 font-dm-serif">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-notable">
            Join Our Mission
          </h2>
          <p className="text-xl text-gray-300 mb-8 font-dm-serif max-w-2xl mx-auto">
            Be part of the movement to democratize great design. Create your first logo today 
            or reach out to learn more about our vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-gray-900 px-8 py-4 rounded-xl font-dm-serif font-semibold transition-colors">
              Create Your Logo
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-dm-serif font-medium transition-colors backdrop-blur-sm">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}