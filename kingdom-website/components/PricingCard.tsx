import React from 'react';

interface PricingFeature {
    text: string;
    included: boolean;
}

interface PricingTier {
    name: string;
    price: string;
    description: string;
    features: PricingFeature[];
    popular?: boolean;
    cta: string;
    href: string;
}

interface PricingCardProps {
    appName: string;
    appIcon: string;
    tiers: PricingTier[];
}

export default function PricingCard({ appName, appIcon, tiers }: PricingCardProps) {
    return (
        <div className="card-glass p-8">
            {/* App Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-kingdom-gold to-kingdom-orange flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{appIcon}</span>
                </div>
                <h3 className="text-heading-secondary mb-2">{appName}</h3>
                <p className="text-body-secondary">Choose the perfect plan for your needs</p>
            </div>

            {/* Pricing Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tiers.map((tier, index) => (
                    <div
                        key={index}
                        className={`relative card-standard ${tier.popular
                                ? 'border-kingdom-gold bg-gradient-to-br from-kingdom-gold/10 to-kingdom-orange/10'
                                : ''
                            }`}
                    >
                        {/* Popular Badge */}
                        {tier.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <span className="bg-gradient-to-r from-kingdom-gold to-kingdom-orange text-kingdom-dark px-4 py-1 rounded-full text-sm font-semibold">
                                    Most Popular
                                </span>
                            </div>
                        )}

                        {/* Tier Header */}
                        <div className="text-center mb-6">
                            <h4 className="text-heading-secondary mb-2">{tier.name}</h4>
                            <div className="mb-2">
                                <span className="text-3xl font-bold text-white">{tier.price}</span>
                                {tier.price !== 'Free' && <span className="text-body-secondary">/month</span>}
                            </div>
                            <p className="text-body-secondary">{tier.description}</p>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 mb-6">
                            {tier.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-start space-x-3">
                                    <div className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center ${feature.included
                                            ? 'bg-kingdom-gold text-kingdom-dark'
                                            : 'bg-gray-600 text-gray-400'
                                        }`}>
                                        {feature.included ? (
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`text-sm ${feature.included ? 'text-body-primary' : 'text-body-secondary'}`}>
                                        {feature.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <a
                            href={tier.href}
                            className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${tier.popular
                                    ? 'btn-kingdom-primary'
                                    : 'btn-kingdom-secondary'
                                }`}
                        >
                            {tier.cta}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
} 