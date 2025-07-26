import React from 'react';

interface AppCardProps {
    title: string;
    description: string;
    icon: string;
    color: string;
    href?: string;
}

export default function AppCard({ title, description, icon, color, href }: AppCardProps) {
    const CardContent = () => (
        <div className={`relative p-6 rounded-2xl border border-kingdom-royal/20 bg-gradient-to-br from-kingdom-darker/50 to-kingdom-dark/50 backdrop-blur-sm card-hover group`}>
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-${color}/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

            {/* Content */}
            <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-${color} to-${color}/70 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-playfair font-semibold text-white mb-3 group-hover:text-kingdom-royal transition-colors duration-300">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {description}
                </p>

                {/* Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <svg className="w-5 h-5 text-kingdom-royal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </div>
    );

    if (href) {
        return (
            <a href={href} className="block">
                <CardContent />
            </a>
        );
    }

    return <CardContent />;
} 