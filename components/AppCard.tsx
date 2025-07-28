import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AppCardProps {
  title: string;
  description: string;
  icon: string;
  logo: string;
  color: string;
  href: string;
}

export default function AppCard({
  title,
  description,
  icon,
  logo,
  color,
  href,
}: AppCardProps) {
  return (
    <Link href={href}>
      <div className="group relative bg-navy/30 border border-gray rounded-xl p-6 hover:bg-navy/50 hover:border-blue/50 transition-all duration-300 hover:scale-105">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue/10 to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-4">
            <Image
              src={logo}
              alt={`${title} Logo`}
              width={64}
              height={64}
              className="h-16 w-auto rounded-xl"
              priority
            />
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue transition-colors duration-200">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-white leading-relaxed">
            {description}
          </p>
          
          {/* Arrow indicator */}
          <div className="mt-4 flex items-center text-blue opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-sm font-medium">Learn more</span>
            <svg
              className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
} 