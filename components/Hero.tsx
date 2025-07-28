import React from 'react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0e0e17] to-[#050510] px-4 text-center">
      <div className="max-w-3xl">
        <Image
          src="/kingdom-collective-logo.png"
          alt="Kingdom Collective Logo"
          width={350}
          height={350}
          className="mx-auto mb-6 max-w-[350px] w-full drop-shadow-xl"
          priority
        />
        <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
          Create with Purpose. Share with Authority. <br />
          Build What Matters.
        </p>
      </div>
    </section>
  );
} 