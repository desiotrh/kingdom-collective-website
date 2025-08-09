interface ChatAvatarProps {
  tone: 'marketplace' | 'kingdom';
}

export default function ChatAvatar({ tone }: ChatAvatarProps) {
  const isKingdom = tone === 'kingdom';
  
  return (
    <div className="relative">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
        isKingdom 
          ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
          : 'bg-gradient-to-br from-blue-400 to-purple-500'
      }`}>
        {/* Flame SVG for Kingdom, or abstract shape for Marketplace */}
        {isKingdom ? (
          <svg 
            className="w-6 h-6 text-white" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM12 20C13.1 20 14 20.9 14 22C14 23.1 13.1 24 12 24C10.9 24 10 23.1 10 22C10 20.9 10.9 20 12 20Z"/>
          </svg>
        ) : (
          <svg 
            className="w-6 h-6 text-white" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17V7L12 12L2 7V17Z"/>
          </svg>
        )}
      </div>
      
      {/* Animated glow effect for Kingdom */}
      {isKingdom && (
        <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-pulse"></div>
      )}
    </div>
  );
} 