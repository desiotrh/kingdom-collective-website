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
                
                {/* Test button to verify Layout is working */}
                <div className="fixed left-4 top-4 z-[9999]">
                    <button
                        onClick={() => alert('Layout component is working!')}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-bold"
                    >
                        🔥 TEST LAYOUT
                    </button>
                </div>

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

                {/* Fallback button in case the main one doesn't show */}
                <div className="fixed right-4 top-4 z-[9998]">
                    <button
                        onClick={handleToggleChat}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-bold"
                    >
                        🤖 TEST BOT
                    </button>
                </div>
            </div>
        </>
    );
} 