import React from 'react';
import Link from 'next/link';

export default function CartIcon() {
  // For now, we'll use a static count since CartContext isn't implemented
  const itemCount: number = 0;

  return (
    <Link 
      href="/cart" 
      className="relative flex items-center text-white hover:text-blue transition-colors duration-200"
      aria-label={`Shopping cart${itemCount > 0 ? ` with ${itemCount} item${itemCount === 1 ? '' : 's'}` : ''}`}
    >
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {itemCount > 0 && (
        <span 
          className="absolute -top-2 -right-2 bg-kingdom-gold text-kingdom-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          aria-label={`${itemCount} item${itemCount === 1 ? '' : 's'} in cart`}
        >
          {itemCount}
        </span>
      )}
    </Link>
  );
} 