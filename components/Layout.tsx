import React from 'react';
import Head from 'next/head';
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function Layout({ children, title = 'Kingdom Collective', description = 'Create with Purpose. Share with Authority. Build What Matters.' }: LayoutProps) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#1e3a8a" />

                {/* Open Graph */}
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://kingdomcollective.pro" />
                <meta property="og:image" content="https://kingdomcollective.pro/logo.png" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content="https://kingdomcollective.pro/logo.png" />

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

                {/* Preconnect to external domains */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://desitotrh.com" />
            </Head>

            <div className="min-h-screen gradient-bg">
                <Navigation />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </>
    );
} 