import React from 'react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 text-center -mt-20">
      <div className="max-w-3xl w-full">
        <Image
          src="/kingdom-collective-logo.png"
          alt="Kingdom Collective Logo"
          width={600}
          height={600}
          className="mx-auto mb-0 max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] w-full drop-shadow-xl -mb-8 sm:-mb-10 md:-mb-12"
          priority
        />
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light leading-relaxed -mt-20 sm:-mt-24 md:-mt-28 lg:-mt-36 px-4">
          Create with Purpose. Share with Authority. <br />
          Build What Matters.
        </p>
      </div>
    </section>
  );
} 