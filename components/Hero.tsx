import React from 'react';

export default function Hero() {
  return (
    <section className="flex justify-center items-center h-screen bg-navy text-white relative text-center px-8">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm"></div>
      
      {/* Hero content */}
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-playfair font-bold text-white mb-6 leading-tight">
          Create with Purpose. Share with Authority. Build What Matters.
        </h1>
        
        <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Empowering digital creators to lead with boldness and build what lasts.
        </p>
        
        <button className="px-8 py-4 text-lg bg-transparent border-2 border-gold text-gold rounded-lg transition-all duration-300 hover:bg-gold hover:text-black shadow-lg shadow-gold/20 hover:shadow-gold/40 font-semibold">
          Get Early Access
        </button>
      </div>
    </section>
  );
} 