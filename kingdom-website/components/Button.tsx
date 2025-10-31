import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
}

export default function Button({ href, onClick, children, className = '', type = 'button' }: ButtonProps) {
  const baseClasses = 'bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-[#FFB347] hover:border-[#FFB347] hover:text-black hover:shadow-[0_0_30px_rgba(255,179,71,0.6)] transition-all duration-300 inline-block text-center';

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
}

