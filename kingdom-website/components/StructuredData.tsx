import React from 'react';
import Head from 'next/head';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'WebPage' | 'Article' | 'SoftwareApplication';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  const structuredData = { ...baseData, ...data };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}

// Organization Schema for Kingdom Collective
export function OrganizationSchema() {
  return (
    <StructuredData
      type="Organization"
      data={{
        name: 'Kingdom Collective',
        url: 'https://kingdomcollective.pro',
        logo: 'https://kingdomcollective.pro/kingdom-collective-logo.png',
        description: 'Create with Purpose. Share with Authority. Build What Matters.',
        sameAs: [
          'https://www.instagram.com/kingdomcollective',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Support',
          email: 'support@kingdomcollective.pro',
        },
      }}
    />
  );
}

// WebSite Schema
export function WebSiteSchema() {
  return (
    <StructuredData
      type="WebSite"
      data={{
        name: 'Kingdom Collective',
        url: 'https://kingdomcollective.pro',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://kingdomcollective.pro/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

// Software Application Schema (for individual apps)
export function SoftwareApplicationSchema(appName: string, appDescription: string, appUrl: string) {
  return (
    <StructuredData
      type="SoftwareApplication"
      data={{
        name: appName,
        applicationCategory: 'BusinessApplication',
        description: appDescription,
        url: appUrl,
        operatingSystem: 'Web, iOS, Android',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          ratingCount: '100',
        },
      }}
    />
  );
}

