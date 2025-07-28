import React from 'react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="flex items-center justify-center min-h-screen px-4 text-center -mt-20">
      <div className="max-w-3xl">
        <Image
          src="/kingdom-collective-logo.png"
          alt="Kingdom Collective Logo"
          width={600}
          height={600}
          className="mx-auto mb-0 max-w-[600px] w-full drop-shadow-xl -mb-12"
          priority
        />
        <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed -mt-36">
          Create with Purpose. Share with Authority. <br />
          Build What Matters.
        </p>
      </div>
    </section>
  );
} 