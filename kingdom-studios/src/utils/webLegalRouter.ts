import { Platform } from 'react-native';

// Web-specific router for legal pages
export const getWebLegalRoute = () => {
  if (Platform.OS !== 'web') {
    return null;
  }

  // Get current pathname
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  switch (pathname) {
    case '/terms':
      return 'terms';
    case '/privacy':
      return 'privacy';
    default:
      return null;
  }
};

// Initialize web routes
export const initializeWebRoutes = () => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return;
  }

  // Handle route changes
  const handleRouteChange = () => {
    const pathname = window.location.pathname;
    
    if (pathname === '/terms' || pathname === '/privacy') {
      // These routes will be handled by WebLegalRouter
      return;
    }
  };

  // Listen for route changes
  window.addEventListener('popstate', handleRouteChange);
  
  // Initial route check
  handleRouteChange();
  
  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handleRouteChange);
  };
};

// SEO metadata for legal pages
export const getLegalPageMetadata = (page: 'terms' | 'privacy') => {
  const baseMetadata = {
    author: 'Kingdom Studios',
    robots: 'index, follow',
    'og:site_name': 'Kingdom Studios',
    'og:type': 'website',
    'twitter:card': 'summary',
    'twitter:site': '@kingdomstudios',
  };

  if (page === 'terms') {
    return {
      ...baseMetadata,
      title: 'Terms of Service | Kingdom Studios',
      description: 'Terms of Service for Kingdom Studios App - Content creation platform for creators and faith-based community.',
      'og:title': 'Terms of Service | Kingdom Studios',
      'og:description': 'Terms of Service for Kingdom Studios App - Content creation platform for creators and faith-based community.',
      'og:url': 'https://kingdomstudiosapp.com/terms',
      canonical: 'https://kingdomstudiosapp.com/terms',
    };
  }

  if (page === 'privacy') {
    return {
      ...baseMetadata,
      title: 'Privacy Policy | Kingdom Studios',
      description: 'Privacy Policy for Kingdom Studios App - Learn how we protect your data and privacy.',
      'og:title': 'Privacy Policy | Kingdom Studios',
      'og:description': 'Privacy Policy for Kingdom Studios App - Learn how we protect your data and privacy.',
      'og:url': 'https://kingdomstudiosapp.com/privacy',
      canonical: 'https://kingdomstudiosapp.com/privacy',
    };
  }

  return baseMetadata;
};

// Helper to update page metadata
export const updatePageMetadata = (metadata: Record<string, string>) => {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return;
  }

  // Update page title
  if (metadata.title) {
    document.title = metadata.title;
  }

  // Update meta tags
  Object.entries(metadata).forEach(([key, value]) => {
    if (key === 'title') return; // Already handled

    let selector = `meta[name="${key}"]`;
    if (key.startsWith('og:')) {
      selector = `meta[property="${key}"]`;
    }

    let metaTag = document.querySelector(selector);
    
    if (!metaTag) {
      metaTag = document.createElement('meta');
      if (key.startsWith('og:')) {
        metaTag.setAttribute('property', key);
      } else {
        metaTag.setAttribute('name', key);
      }
      document.head.appendChild(metaTag);
    }
    
    metaTag.setAttribute('content', value);
  });
};
