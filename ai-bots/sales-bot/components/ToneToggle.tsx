interface ToneToggleProps {
  tone: 'marketplace' | 'kingdom';
  onToneChange: (tone: 'marketplace' | 'kingdom') => void;
}

export default function ToneToggle({ tone, onToneChange }: ToneToggleProps) {
  const isKingdom = tone === 'kingdom';

  return (
    <div className="flex items-center space-x-3">
      <span className={`text-sm font-medium transition-colors ${
        !isKingdom ? 'text-blue-400' : 'text-gray-400'
      }`}>
        Marketplace
      </span>
      
      <button
        onClick={() => onToneChange(isKingdom ? 'marketplace' : 'kingdom')}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isKingdom 
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
            : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isKingdom ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      
      <span className={`text-sm font-medium transition-colors ${
        isKingdom ? 'text-yellow-400' : 'text-gray-400'
      }`}>
        Kingdom
      </span>
    </div>
  );
} 