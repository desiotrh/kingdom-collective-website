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
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-black/30 transition-all duration-200 h-full flex flex-col group">
        {/* Logo with fallback */}
        <div className="mb-4">
          <div className="h-16 w-16 rounded-lg bg-kingdom-gold/20 flex items-center justify-center text-2xl">
            {icon}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-white text-xl font-bold mb-3 group-hover:text-kingdom-gold transition-colors duration-200">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-white/80 flex-1 leading-relaxed">
          {description}
        </p>
        
        {/* Arrow indicator */}
        <div className="mt-4 flex items-center text-kingdom-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-sm font-medium">Learn more</span>
          <svg
            className="w-4 h-4 ml-2"
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
    </Link>
  );
}