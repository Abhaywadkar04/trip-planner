import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Main Hero Section */}
      <div className="flex flex-col items-center max-w-6xl mx-auto px-4 pt-20 pb-32">
        
        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-orange-100 px-6 py-3 rounded-full mb-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700">✨ Powered by Advanced AI</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-extrabold text-5xl md:text-6xl lg:text-7xl text-center leading-tight mb-8 max-w-5xl">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
            Discover Your Next Adventure
          </span>
          <br />
          <span className="text-gray-800 text-4xl md:text-5xl lg:text-6xl mt-2 block">
            with AI-Powered Planning
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 text-center max-w-3xl leading-relaxed mb-12">
          Get personalized recommendations for destinations, activities, and itineraries. 
          <span className="text-orange-600 font-semibold"> No more endless searching</span> — 
          just seamless, intelligent travel planning.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link to="/create-trip">
            <Button className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-[200px]">
              🚀 Start Planning Free
            </Button>
          </Link>
          <Button 
            variant="outline"
            className="border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 min-w-[200px]"
          >
            📖 See How It Works
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 group hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Recommendations</h3>
            <p className="text-gray-600 leading-relaxed">AI analyzes your preferences to suggest perfect destinations, activities, and experiences tailored just for you.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 group hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Itineraries</h3>
            <p className="text-gray-600 leading-relaxed">Generate complete travel plans in seconds. From flights to activities, everything organized perfectly for your schedule.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 group hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <span className="text-3xl">💝</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Budget Friendly</h3>
            <p className="text-gray-600 leading-relaxed">Get amazing travel experiences within your budget. Our AI optimizes costs without compromising on quality.</p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by thousands of travelers worldwide</p>
          <div className="flex items-center justify-center gap-6 opacity-60">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
              <span className="text-sm font-medium">4.9/5 Rating</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="text-sm font-medium">50,000+ Trips Planned</div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="text-sm font-medium">100% Free to Use</div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-30 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
        <div className="w-20 h-20 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full"></div>
      </div>
      <div className="absolute top-40 right-20 opacity-30 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}>
        <div className="w-16 h-16 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full"></div>
      </div>
      <div className="absolute bottom-40 left-20 opacity-30 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}>
        <div className="w-12 h-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full"></div>
      </div>
    </div>
  )
}

export default Hero