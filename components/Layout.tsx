import React, { useState } from 'react';
import Head from 'next/head';
import FloatingFlameButton from './FloatingFlameButton';
import EnhancedChatWindow from './EnhancedChatWindow';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function Layout({ children, title = 'Kingdom Collective', description = 'Create with Purpose. Share with Authority. Build What Matters.' }: LayoutProps) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('/');

    const handleToggleChat = () => {
        console.log('Toggle chat clicked!', { isChatOpen });
        setIsChatOpen(!isChatOpen);
    };

    const handleCloseChat = () => {
        console.log('Close chat clicked!');
        setIsChatOpen(false);
    };

    // Update current page based on window location
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            console.log('Current page:', path);
            setCurrentPage(path);
        }
    }, []);

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                
                {/* Open Graph */}
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://kingdomcollective.pro" />
                <meta property="og:image" content="https://kingdomcollective.pro/og-image.jpg" />
                
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content="https://kingdomcollective.pro/og-image.jpg" />
                
                {/* Preconnect to external domains */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                
                {/* Theme Color */}
                <meta name="theme-color" content="#144e9c" />
            </Head>
            
            <div className="min-h-screen bg-gradient-to-br from-kingdom-dark via-kingdom-darker to-kingdom-navy">
                {children}

                {/* Enhanced Sales Bot */}
                <FloatingFlameButton 
                    onToggle={handleToggleChat}
                    isOpen={isChatOpen}
                    currentPage={currentPage}
                />
                
                {isChatOpen && (
                    <EnhancedChatWindow
                        isOpen={isChatOpen}
                        onClose={handleCloseChat}
                        currentPage={currentPage}
                    />
                )}
            </div>
        </>
    );
} 