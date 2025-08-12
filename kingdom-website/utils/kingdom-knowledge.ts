export interface KingdomApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  pricing: {
    basic: string;
    premium: string;
    enterprise: string;
  };
  useCases: string[];
  benefits: string[];
  targetAudience: string[];
  pageUrl: string;
  biblicalPrinciples: string[];
}

export interface KingdomCollective {
  vision: string;
  mission: string;
  values: string[];
  biblicalFoundation: string[];
  apps: KingdomApp[];
  pricing: {
    individual: string;
    bundle: string;
    enterprise: string;
  };
  testimonials: string[];
  successStories: string[];
}

export const kingdomCollective: KingdomCollective = {
  vision: "To create a digital ecosystem that empowers individuals and businesses to achieve their highest potential through innovative technology solutions grounded in biblical truth and eternal values.",
  mission: "We build cutting-edge applications that combine modern technology with timeless biblical wisdom, helping users connect, create, and grow in ways that honor God and serve others.",
  values: [
    "Innovation with Purpose",
    "Biblical Truth and Integrity",
    "Servant Leadership",
    "Excellence in Execution",
    "Community Building",
    "Stewardship of Resources"
  ],
  biblicalFoundation: [
    "Proverbs 3:5-6 - Trust in the Lord with all your heart and lean not on your own understanding",
    "Matthew 6:33 - Seek first the kingdom of God and His righteousness",
    "1 Corinthians 10:31 - Whatever you do, do it all for the glory of God",
    "Colossians 3:23 - Work heartily as for the Lord and not for men",
    "Proverbs 16:3 - Commit your work to the Lord, and your plans will be established"
  ],
  apps: [
    {
      id: "kingdom-voice",
      name: "Kingdom Voice",
      tagline: "Your Voice, Amplified with Purpose",
      description: "Advanced voice recognition and AI-powered communication platform that transforms how you interact with technology while maintaining biblical integrity in all communications.",
      features: [
        "AI-powered voice recognition",
        "Multi-language support",
        "Voice-to-text transcription",
        "Custom voice commands",
        "Integration with smart devices",
        "Voice analytics dashboard",
        "Content filtering for wholesome communication"
      ],
      pricing: {
        basic: "$29/month",
        premium: "$79/month",
        enterprise: "Custom pricing"
      },
      useCases: [
        "Hands-free device control",
        "Voice-activated workflows",
        "Accessibility solutions",
        "Meeting transcription",
        "Voice-based customer service"
      ],
      benefits: [
        "Increase productivity by 40%",
        "Reduce typing time by 60%",
        "Improve accessibility",
        "Enhanced user experience",
        "Maintain wholesome communication standards"
      ],
      targetAudience: [
        "Professionals seeking efficiency",
        "Accessibility advocates",
        "Customer service teams",
        "Content creators"
      ],
      pageUrl: "/kingdom-voice",
      biblicalPrinciples: [
        "Proverbs 15:1 - A gentle answer turns away wrath",
        "Ephesians 4:29 - Let no corrupting talk come out of your mouths",
        "James 1:19 - Be quick to hear, slow to speak"
      ]
    },
    {
      id: "kingdom-circle",
      name: "Kingdom Circle",
      tagline: "Connect, Collaborate, Create in Community",
      description: "A comprehensive community platform that brings people together for meaningful collaboration and growth, fostering authentic relationships and mutual support.",
      features: [
        "Private and public communities",
        "Real-time messaging",
        "Video conferencing",
        "File sharing and collaboration",
        "Event management",
        "Analytics and insights",
        "Community guidelines enforcement"
      ],
      pricing: {
        basic: "$19/month",
        premium: "$49/month",
        enterprise: "Custom pricing"
      },
      useCases: [
        "Team collaboration",
        "Online communities",
        "Educational platforms",
        "Professional networking",
        "Event organization"
      ],
      benefits: [
        "Build engaged communities",
        "Improve team collaboration",
        "Increase member retention",
        "Streamline communication",
        "Foster authentic relationships"
      ],
      targetAudience: [
        "Community leaders",
        "Business teams",
        "Educational institutions",
        "Professional networks"
      ],
      pageUrl: "/kingdom-circle",
      biblicalPrinciples: [
        "Hebrews 10:24-25 - Stir up one another to love and good works",
        "Proverbs 27:17 - Iron sharpens iron",
        "1 Thessalonians 5:11 - Encourage one another and build one another up"
      ]
    },
    {
      id: "kingdom-lens",
      name: "Kingdom Lens",
      tagline: "See the World Through God's Eyes",
      description: "Augmented reality platform that enhances your perception and interaction with the world around you, helping you see beauty and opportunity in God's creation.",
      features: [
        "AR visualization tools",
        "3D object recognition",
        "Interactive overlays",
        "Spatial mapping",
        "Cross-platform compatibility",
        "Custom AR experiences",
        "Content filtering for wholesome experiences"
      ],
      pricing: {
        basic: "$39/month",
        premium: "$99/month",
        enterprise: "Custom pricing"
      },
      useCases: [
        "Product visualization",
        "Training and education",
        "Retail experiences",
        "Architecture and design",
        "Entertainment and gaming"
      ],
      benefits: [
        "Enhanced user engagement",
        "Improved learning outcomes",
        "Innovative marketing opportunities",
        "Competitive advantage",
        "Appreciation for God's creation"
      ],
      targetAudience: [
        "Retail businesses",
        "Educational institutions",
        "Architecture firms",
        "Entertainment companies"
      ],
      pageUrl: "/kingdom-lens",
      biblicalPrinciples: [
        "Psalm 19:1 - The heavens declare the glory of God",
        "Genesis 1:31 - God saw everything that He had made, and behold, it was very good",
        "Romans 1:20 - His invisible attributes are clearly seen in creation"
      ]
    },
    {
      id: "kingdom-clips",
      name: "Kingdom Clips",
      tagline: "Capture Every Moment with Meaning",
      description: "Advanced video creation and editing platform that makes professional content creation accessible to everyone while promoting wholesome, uplifting content.",
      features: [
        "AI-powered video editing",
        "Template library",
        "Music and sound effects",
        "Text-to-speech",
        "Social media optimization",
        "Analytics dashboard",
        "Content moderation tools"
      ],
      pricing: {
        basic: "$25/month",
        premium: "$65/month",
        enterprise: "Custom pricing"
      },
      useCases: [
        "Social media content",
        "Marketing videos",
        "Educational content",
        "Product demonstrations",
        "Personal vlogs"
      ],
      benefits: [
        "Save 80% on video production time",
        "Professional-quality output",
        "Increased engagement",
        "Cost-effective content creation",
        "Promote wholesome content"
      ],
      targetAudience: [
        "Content creators",
        "Marketing teams",
        "Educators",
        "Small businesses"
      ],
      pageUrl: "/kingdom-clips",
      biblicalPrinciples: [
        "Philippians 4:8 - Whatever is true, honorable, just, pure, lovely",
        "Colossians 3:17 - Do everything in the name of the Lord Jesus",
        "1 Corinthians 10:31 - Do all to the glory of God"
      ]
    },
    {
      id: "kingdom-launchpad",
      name: "Kingdom Launchpad",
      tagline: "Launch Your Dreams with Divine Purpose",
      description: "Comprehensive platform for entrepreneurs and creators to launch, grow, and scale their businesses with biblical wisdom and ethical practices.",
      features: [
        "Business planning tools",
        "Market research insights",
        "Funding connections",
        "Mentorship network",
        "Progress tracking",
        "Success metrics",
        "Ethical business practices guidance"
      ],
      pricing: {
        basic: "$45/month",
        premium: "$120/month",
        enterprise: "Custom pricing"
      },
      useCases: [
        "Startup development",
        "Business scaling",
        "Product launches",
        "Market expansion",
        "Investment preparation"
      ],
      benefits: [
        "Accelerate business growth",
        "Access to expert mentors",
        "Connect with investors",
        "Track progress effectively",
        "Build businesses with integrity"
      ],
      targetAudience: [
        "Entrepreneurs",
        "Startup founders",
        "Small business owners",
        "Innovators"
      ],
      pageUrl: "/kingdom-launchpad",
      biblicalPrinciples: [
        "Proverbs 16:3 - Commit your work to the Lord",
        "Deuteronomy 8:18 - Remember the Lord your God gives you power to get wealth",
        "Matthew 25:14-30 - Parable of the talents"
      ]
    },
    {
      id: "kingdom-studios",
      name: "Kingdom Studios",
      tagline: "Where Divine Creativity Meets Excellence",
      description: "Premium creative studio platform that provides professional-grade tools for content creation and brand development, honoring God through creative excellence.",
      features: [
        "Advanced design tools",
        "Brand identity creation",
        "Animation and motion graphics",
        "3D modeling and rendering",
        "Collaborative workspace",
        "Asset management",
        "Content standards enforcement"
      ],
      pricing: {
        basic: "$97/month",
        premium: "$297/month",
        enterprise: "Custom pricing"
      },
      useCases: [
        "Brand development",
        "Marketing campaigns",
        "Product design",
        "Animation projects",
        "Creative agency work"
      ],
      benefits: [
        "Professional-quality output",
        "Streamlined creative workflow",
        "Cost-effective solutions",
        "Competitive advantage",
        "Creative excellence for God's glory"
      ],
      targetAudience: [
        "Creative professionals",
        "Marketing agencies",
        "Brand managers",
        "Designers"
      ],
      pageUrl: "/kingdom-studios",
      biblicalPrinciples: [
        "Exodus 31:1-5 - God filled Bezalel with skill and ability",
        "Psalm 96:6 - Splendor and majesty are before Him",
        "Colossians 3:23 - Work heartily as for the Lord"
      ]
    }
  ],
  pricing: {
    individual: "Start at $19/month per app",
    bundle: "$149/month for all apps",
    enterprise: "Custom enterprise solutions"
  },
  testimonials: [
    "Kingdom Voice transformed how our team communicates. We've seen a 40% increase in productivity while maintaining wholesome communication standards!",
    "Kingdom Circle helped us build a thriving community of 10,000+ engaged members who support and encourage one another.",
    "Kingdom Lens created an incredible AR experience for our retail stores. Sales increased by 35% while helping customers appreciate God's creation!",
    "Kingdom Clips made video creation so easy. We're producing 5x more wholesome, uplifting content in half the time.",
    "Kingdom Launchpad connected us with the perfect mentor who helped us secure $500K in funding while building our business with integrity.",
    "Kingdom Studios elevated our brand to a whole new level. The quality is absolutely stunning and honors God through creative excellence."
  ],
  successStories: [
    "A startup used Kingdom Launchpad to secure $2M in funding and scale to 50 employees while maintaining biblical business practices",
    "An educational institution implemented Kingdom Circle and increased student engagement by 60% while fostering authentic community",
    "A retail chain used Kingdom Lens AR technology and saw a 40% increase in customer engagement while helping customers see beauty in creation",
    "A content creator used Kingdom Clips and grew their audience from 1K to 100K followers in 6 months while promoting wholesome content",
    "A marketing agency used Kingdom Studios and increased their client retention rate by 80% while creating work that honors God"
  ]
};

export const getAppByPage = (pageUrl: string): KingdomApp | null => {
  return kingdomCollective.apps.find(app => app.pageUrl === pageUrl) || null;
};

export const getAppById = (id: string): KingdomApp | null => {
  return kingdomCollective.apps.find(app => app.id === id) || null;
};

export const getRecommendedApps = (userNeeds: string[]): KingdomApp[] => {
  const recommendations: KingdomApp[] = [];
  
  userNeeds.forEach(need => {
    kingdomCollective.apps.forEach(app => {
      if (app.useCases.some(useCase => useCase.toLowerCase().includes(need.toLowerCase())) ||
          app.benefits.some(benefit => benefit.toLowerCase().includes(need.toLowerCase()))) {
        if (!recommendations.find(rec => rec.id === app.id)) {
          recommendations.push(app);
        }
      }
    });
  });
  
  return recommendations;
}; 