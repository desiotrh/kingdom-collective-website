import React from 'react';
import Layout from '../components/Layout';
import PricingCard from '../components/PricingCard';

export default function PricingPage() {
    const kingdomStudiosTiers = [
        {
            name: 'Free',
            price: 'Free',
            description: 'Perfect for getting started',
            popular: false,
            cta: 'Get Started',
            href: 'https://app.kingdomcollective.pro/signup',
            features: [
                { text: 'Basic content creation tools', included: true },
                { text: '5 projects per month', included: true },
                { text: 'Standard templates (10 templates)', included: true },
                { text: 'Basic AI assistance', included: true },
                { text: 'Community support', included: true },
                { text: '1GB storage', included: true },
                { text: 'Custom branding', included: false },
                { text: 'Advanced analytics', included: false },
                { text: 'Team collaboration', included: false },
            ]
        },
        {
            name: 'Pro',
            price: '$29',
            description: 'For serious content creators',
            popular: true,
            cta: 'Start Free Trial',
            href: 'https://app.kingdomcollective.pro/pro',
            features: [
                { text: 'Everything in Free', included: true },
                { text: 'Unlimited projects', included: true },
                { text: 'Premium templates (50+ templates)', included: true },
                { text: 'Advanced AI features', included: true },
                { text: 'Custom branding', included: true },
                { text: 'Advanced analytics dashboard', included: true },
                { text: 'Priority support', included: true },
                { text: '50GB storage', included: true },
                { text: 'Export in multiple formats', included: true },
                { text: 'Social media scheduling', included: true },
                { text: 'Team features', included: false },
                { text: 'White-label options', included: false },
            ]
        },
        {
            name: 'Enterprise',
            price: '$99',
            description: 'For teams and businesses',
            popular: false,
            cta: 'Contact Sales',
            href: 'https://app.kingdomcollective.pro/enterprise',
            features: [
                { text: 'Everything in Pro', included: true },
                { text: 'Team collaboration (up to 10 members)', included: true },
                { text: 'White-label options', included: true },
                { text: 'Custom integrations', included: true },
                { text: 'Advanced workflow automation', included: true },
                { text: 'Dedicated account manager', included: true },
                { text: '500GB storage', included: true },
                { text: 'API access', included: true },
                { text: 'Custom training sessions', included: true },
                { text: 'Advanced security features', included: true },
            ]
        }
    ];

    const kingdomClipsTiers = [
        {
            name: 'Free',
            price: 'Free',
            description: 'Start creating videos',
            popular: false,
            cta: 'Get Started',
            href: 'https://clips.kingdomcollective.pro/signup',
            features: [
                { text: 'Basic video editing tools', included: true },
                { text: '3 video exports per month', included: true },
                { text: 'Standard video templates', included: true },
                { text: 'Basic AI video enhancement', included: true },
                { text: 'Community support', included: true },
                { text: '2GB storage', included: true },
                { text: '4K export', included: false },
                { text: 'Advanced effects', included: false },
                { text: 'Custom branding', included: false },
            ]
        },
        {
            name: 'Pro',
            price: '$39',
            description: 'Professional video creation',
            popular: true,
            cta: 'Start Free Trial',
            href: 'https://clips.kingdomcollective.pro/pro',
            features: [
                { text: 'Everything in Free', included: true },
                { text: 'Unlimited video exports', included: true },
                { text: 'Premium video templates', included: true },
                { text: 'Advanced AI video enhancement', included: true },
                { text: '4K export quality', included: true },
                { text: 'Custom branding', included: true },
                { text: 'Advanced video effects', included: true },
                { text: 'Priority support', included: true },
                { text: '100GB storage', included: true },
                { text: 'Multiple export formats', included: true },
                { text: 'Social media optimization', included: true },
                { text: 'Team collaboration', included: false },
                { text: 'White-label options', included: false },
            ]
        },
        {
            name: 'Enterprise',
            price: '$129',
            description: 'For video production teams',
            popular: false,
            cta: 'Contact Sales',
            href: 'https://clips.kingdomcollective.pro/enterprise',
            features: [
                { text: 'Everything in Pro', included: true },
                { text: 'Team collaboration (up to 15 members)', included: true },
                { text: 'White-label video platform', included: true },
                { text: 'Custom video integrations', included: true },
                { text: 'Advanced video analytics', included: true },
                { text: 'Dedicated video specialist', included: true },
                { text: '1TB storage', included: true },
                { text: 'API access for video processing', included: true },
                { text: 'Custom video workflows', included: true },
                { text: 'Advanced security and compliance', included: true },
            ]
        }
    ];

    const kingdomVoiceTiers = [
        {
            name: 'Free',
            price: 'Free',
            description: 'Start your podcast journey',
            popular: false,
            cta: 'Get Started',
            href: 'https://voice.kingdomcollective.pro/signup',
            features: [
                { text: 'Basic audio recording tools', included: true },
                { text: '2 episodes per month', included: true },
                { text: 'Standard audio templates', included: true },
                { text: 'Basic AI audio enhancement', included: true },
                { text: 'Community support', included: true },
                { text: '1GB storage', included: true },
                { text: 'Advanced editing', included: false },
                { text: 'Custom branding', included: false },
                { text: 'Distribution tools', included: false },
            ]
        },
        {
            name: 'Pro',
            price: '$24',
            description: 'Professional audio production',
            popular: true,
            cta: 'Start Free Trial',
            href: 'https://voice.kingdomcollective.pro/pro',
            features: [
                { text: 'Everything in Free', included: true },
                { text: 'Unlimited episodes', included: true },
                { text: 'Premium audio templates', included: true },
                { text: 'Advanced AI audio enhancement', included: true },
                { text: 'Professional audio editing', included: true },
                { text: 'Custom branding', included: true },
                { text: 'Distribution to major platforms', included: true },
                { text: 'Priority support', included: true },
                { text: '50GB storage', included: true },
                { text: 'Multiple audio formats', included: true },
                { text: 'Audio analytics', included: true },
                { text: 'Team collaboration', included: false },
                { text: 'White-label options', included: false },
            ]
        },
        {
            name: 'Enterprise',
            price: '$79',
            description: 'For podcast networks and studios',
            popular: false,
            cta: 'Contact Sales',
            href: 'https://voice.kingdomcollective.pro/enterprise',
            features: [
                { text: 'Everything in Pro', included: true },
                { text: 'Team collaboration (up to 10 members)', included: true },
                { text: 'White-label podcast platform', included: true },
                { text: 'Custom audio integrations', included: true },
                { text: 'Advanced podcast analytics', included: true },
                { text: 'Dedicated audio specialist', included: true },
                { text: '500GB storage', included: true },
                { text: 'API access for audio processing', included: true },
                { text: 'Custom audio workflows', included: true },
                { text: 'Advanced security features', included: true },
            ]
        }
    ];

    const kingdomLaunchpadTiers = [
        {
            name: 'Free',
            price: 'Free',
            description: 'Start your business journey',
            popular: false,
            cta: 'Get Started',
            href: 'https://launchpad.kingdomcollective.pro/signup',
            features: [
                { text: 'Basic business planning tools', included: true },
                { text: '1 business plan', included: true },
                { text: 'Standard business templates', included: true },
                { text: 'Basic financial calculators', included: true },
                { text: 'Community support', included: true },
                { text: '1GB storage', included: true },
                { text: 'Advanced analytics', included: false },
                { text: 'Custom branding', included: false },
                { text: 'Team features', included: false },
            ]
        },
        {
            name: 'Pro',
            price: '$49',
            description: 'Professional business tools',
            popular: true,
            cta: 'Start Free Trial',
            href: 'https://launchpad.kingdomcollective.pro/pro',
            features: [
                { text: 'Everything in Free', included: true },
                { text: 'Unlimited business plans', included: true },
                { text: 'Premium business templates', included: true },
                { text: 'Advanced financial modeling', included: true },
                { text: 'Custom branding', included: true },
                { text: 'Business analytics dashboard', included: true },
                { text: 'Priority support', included: true },
                { text: '100GB storage', included: true },
                { text: 'Export in multiple formats', included: true },
                { text: 'Investor pitch tools', included: true },
                { text: 'Market research tools', included: true },
                { text: 'Team collaboration', included: false },
                { text: 'White-label options', included: false },
            ]
        },
        {
            name: 'Enterprise',
            price: '$199',
            description: 'For business teams and accelerators',
            popular: false,
            cta: 'Contact Sales',
            href: 'https://launchpad.kingdomcollective.pro/enterprise',
            features: [
                { text: 'Everything in Pro', included: true },
                { text: 'Team collaboration (up to 20 members)', included: true },
                { text: 'White-label business platform', included: true },
                { text: 'Custom business integrations', included: true },
                { text: 'Advanced business analytics', included: true },
                { text: 'Dedicated business consultant', included: true },
                { text: '1TB storage', included: true },
                { text: 'API access for business data', included: true },
                { text: 'Custom business workflows', included: true },
                { text: 'Advanced security and compliance', included: true },
            ]
        }
    ];

    const kingdomCircleTiers = [
        {
            name: 'Free',
            price: 'Free',
            description: 'Build your community',
            popular: false,
            cta: 'Get Started',
            href: 'https://circle.kingdomcollective.pro/signup',
            features: [
                { text: 'Basic community features', included: true },
                { text: 'Up to 100 members', included: true },
                { text: 'Standard community templates', included: true },
                { text: 'Basic engagement tools', included: true },
                { text: 'Community support', included: true },
                { text: '1GB storage', included: true },
                { text: 'Advanced analytics', included: false },
                { text: 'Custom branding', included: false },
                { text: 'Team features', included: false },
            ]
        },
        {
            name: 'Pro',
            price: '$19',
            description: 'Professional community building',
            popular: true,
            cta: 'Start Free Trial',
            href: 'https://circle.kingdomcollective.pro/pro',
            features: [
                { text: 'Everything in Free', included: true },
                { text: 'Up to 1,000 members', included: true },
                { text: 'Premium community templates', included: true },
                { text: 'Advanced engagement tools', included: true },
                { text: 'Custom branding', included: true },
                { text: 'Community analytics dashboard', included: true },
                { text: 'Priority support', included: true },
                { text: '50GB storage', included: true },
                { text: 'Advanced moderation tools', included: true },
                { text: 'Event management', included: true },
                { text: 'Member management tools', included: true },
                { text: 'Team collaboration', included: false },
                { text: 'White-label options', included: false },
            ]
        },
        {
            name: 'Enterprise',
            price: '$79',
            description: 'For large communities and organizations',
            popular: false,
            cta: 'Contact Sales',
            href: 'https://circle.kingdomcollective.pro/enterprise',
            features: [
                { text: 'Everything in Pro', included: true },
                { text: 'Unlimited members', included: true },
                { text: 'Team collaboration (up to 10 moderators)', included: true },
                { text: 'White-label community platform', included: true },
                { text: 'Custom community integrations', included: true },
                { text: 'Advanced community analytics', included: true },
                { text: 'Dedicated community manager', included: true },
                { text: '500GB storage', included: true },
                { text: 'API access for community data', included: true },
                { text: 'Custom community workflows', included: true },
                { text: 'Advanced security and compliance', included: true },
            ]
        }
    ];

    const kingdomLensTiers = [
        {
            name: 'Free',
            price: 'Free',
            description: 'Start capturing moments',
            popular: false,
            cta: 'Get Started',
            href: 'https://lens.kingdomcollective.pro/signup',
            features: [
                { text: 'Basic photo editing tools', included: true },
                { text: '10 photo edits per month', included: true },
                { text: 'Standard photo templates', included: true },
                { text: 'Basic AI photo enhancement', included: true },
                { text: 'Community support', included: true },
                { text: '2GB storage', included: true },
                { text: 'Advanced editing', included: false },
                { text: 'Custom branding', included: false },
                { text: 'Professional tools', included: false },
            ]
        },
        {
            name: 'Pro',
            price: '$29',
            description: 'Professional photography',
            popular: true,
            cta: 'Start Free Trial',
            href: 'https://lens.kingdomcollective.pro/pro',
            features: [
                { text: 'Everything in Free', included: true },
                { text: 'Unlimited photo edits', included: true },
                { text: 'Premium photo templates', included: true },
                { text: 'Advanced AI photo enhancement', included: true },
                { text: 'Professional editing tools', included: true },
                { text: 'Custom branding', included: true },
                { text: 'Advanced photo effects', included: true },
                { text: 'Priority support', included: true },
                { text: '100GB storage', included: true },
                { text: 'Multiple export formats', included: true },
                { text: 'Photo analytics', included: true },
                { text: 'Team collaboration', included: false },
                { text: 'White-label options', included: false },
            ]
        },
        {
            name: 'Enterprise',
            price: '$99',
            description: 'For photography studios and teams',
            popular: false,
            cta: 'Contact Sales',
            href: 'https://lens.kingdomcollective.pro/enterprise',
            features: [
                { text: 'Everything in Pro', included: true },
                { text: 'Team collaboration (up to 10 photographers)', included: true },
                { text: 'White-label photography platform', included: true },
                { text: 'Custom photo integrations', included: true },
                { text: 'Advanced photo analytics', included: true },
                { text: 'Dedicated photography specialist', included: true },
                { text: '1TB storage', included: true },
                { text: 'API access for photo processing', included: true },
                { text: 'Custom photo workflows', included: true },
                { text: 'Advanced security features', included: true },
            ]
        }
    ];

    return (
        <Layout
            title="Pricing - Kingdom Collective"
            description="Choose the perfect plan for your Kingdom Collective apps. Free, Pro, and Enterprise tiers for every need."
        >
            <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-white mb-6">
                            Kingdom <span className="glow-text">Pricing</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Choose the perfect plan for your creative journey. Every app offers Free, Pro, and Enterprise tiers
                            designed to grow with your needs.
                        </p>
                    </div>

                    {/* Bundle Pricing */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-playfair font-bold text-white mb-4">
                                🏰 Kingdom Collective Bundle
                            </h2>
                            <p className="text-lg text-gray-400">
                                Get access to all 6 apps at a discounted rate
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Individual Bundle */}
                            <div className="bg-gradient-to-br from-kingdom-blue/20 to-kingdom-royal/20 rounded-2xl p-8 border border-kingdom-royal/30">
                                <h3 className="text-2xl font-playfair font-bold text-white mb-4">Individual Bundle</h3>
                                <div className="text-4xl font-bold text-white mb-2">$99<span className="text-lg text-gray-400">/month</span></div>
                                <p className="text-gray-400 mb-6">Access to all 6 apps at Pro level</p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        All 6 apps at Pro level
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        Cross-app integration
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        Unified dashboard
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        500GB total storage
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        Save $120/month
                                    </li>
                                </ul>
                                <a href="#contact" className="button-primary w-full text-center">
                                    Get Bundle
                                </a>
                            </div>

                            {/* Team Bundle */}
                            <div className="bg-gradient-to-br from-kingdom-gold/20 to-kingdom-amber/20 rounded-2xl p-8 border border-kingdom-gold/30 relative">
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-kingdom-gold to-kingdom-amber text-kingdom-dark px-4 py-1 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </span>
                                </div>
                                <h3 className="text-2xl font-playfair font-bold text-white mb-4">Team Bundle</h3>
                                <div className="text-4xl font-bold text-white mb-2">$299<span className="text-lg text-gray-400">/month</span></div>
                                <p className="text-gray-400 mb-6">Enterprise access for teams</p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        All apps at Enterprise level
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        Up to 10 team members per app
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        White-label options
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        5TB total storage
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        Save $600/month
                                    </li>
                                </ul>
                                <a href="#contact" className="bg-gradient-to-r from-kingdom-gold to-kingdom-amber text-kingdom-dark px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-kingdom-gold/30 transition-all duration-300 w-full text-center block">
                                    Get Team Bundle
                                </a>
                            </div>

                            {/* Agency Bundle */}
                            <div className="bg-gradient-to-br from-kingdom-royal/20 to-kingdom-sky/20 rounded-2xl p-8 border border-kingdom-royal/30">
                                <h3 className="text-2xl font-playfair font-bold text-white mb-4">Agency Bundle</h3>
                                <div className="text-4xl font-bold text-white mb-2">$599<span className="text-lg text-gray-400">/month</span></div>
                                <p className="text-gray-400 mb-6">For agencies and large organizations</p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        All apps at Enterprise level
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        Up to 25 team members per app
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        Full white-label options
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        10TB total storage
                                    </li>
                                    <li className="flex items-center text-gray-300">
                                        <span className="text-kingdom-gold mr-2">✓</span>
                                        Dedicated success manager
                                    </li>
                                </ul>
                                <a href="#contact" className="button-secondary w-full text-center">
                                    Contact Sales
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Individual App Pricing */}
                    <div className="space-y-20">
                        <PricingCard
                            appName="Kingdom Studios"
                            appIcon="🎬"
                            tiers={kingdomStudiosTiers}
                        />

                        <PricingCard
                            appName="Kingdom Clips"
                            appIcon="🎥"
                            tiers={kingdomClipsTiers}
                        />

                        <PricingCard
                            appName="Kingdom Voice"
                            appIcon="🎙️"
                            tiers={kingdomVoiceTiers}
                        />

                        <PricingCard
                            appName="Kingdom Launchpad"
                            appIcon="🚀"
                            tiers={kingdomLaunchpadTiers}
                        />

                        <PricingCard
                            appName="Kingdom Circle"
                            appIcon="🔥"
                            tiers={kingdomCircleTiers}
                        />

                        <PricingCard
                            appName="Kingdom Lens"
                            appIcon="📸"
                            tiers={kingdomLensTiers}
                        />
                    </div>

                    {/* Special Offers */}
                    <div className="mt-20 text-center">
                        <h2 className="text-3xl font-playfair font-bold text-white mb-8">
                            🎁 Special Offers
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-kingdom-dark/50 rounded-xl p-6 border border-kingdom-royal/20">
                                <h3 className="text-xl font-semibold text-white mb-2">New User Discount</h3>
                                <p className="text-kingdom-gold font-bold text-lg mb-2">50% off first 3 months</p>
                                <p className="text-gray-400 text-sm">Available for all Pro and Enterprise plans</p>
                            </div>

                            <div className="bg-kingdom-dark/50 rounded-xl p-6 border border-kingdom-royal/20">
                                <h3 className="text-xl font-semibold text-white mb-2">Student Discount</h3>
                                <p className="text-kingdom-gold font-bold text-lg mb-2">40% off all plans</p>
                                <p className="text-gray-400 text-sm">Valid student ID required</p>
                            </div>

                            <div className="bg-kingdom-dark/50 rounded-xl p-6 border border-kingdom-royal/20">
                                <h3 className="text-xl font-semibold text-white mb-2">Non-Profit Discount</h3>
                                <p className="text-kingdom-gold font-bold text-lg mb-2">30% off all plans</p>
                                <p className="text-gray-400 text-sm">501(c)(3) verification required</p>
                            </div>

                            <div className="bg-kingdom-dark/50 rounded-xl p-6 border border-kingdom-royal/20">
                                <h3 className="text-xl font-semibold text-white mb-2">Referral Program</h3>
                                <p className="text-kingdom-gold font-bold text-lg mb-2">1 month free per referral</p>
                                <p className="text-gray-400 text-sm">No limit on referrals</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-20 text-center">
                        <h2 className="text-3xl font-playfair font-bold text-white mb-6">
                            Need Custom Pricing?
                        </h2>
                        <p className="text-lg text-gray-400 mb-8">
                            Contact our sales team for custom enterprise solutions and volume discounts.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="mailto:sales@kingdomcollective.pro" className="button-primary">
                                Contact Sales
                            </a>
                            <a href="tel:+1-555-KINGDOM" className="button-secondary">
                                Call Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 