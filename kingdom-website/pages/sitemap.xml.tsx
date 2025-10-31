import { GetServerSideProps } from 'next';

function generateSiteMap() {
  const baseUrl = 'https://kingdomcollective.pro';
  
  const pages = [
    '',
    '/kingdom-stand',
    '/kingdom-circle',
    '/kingdom-clips',
    '/kingdom-launchpad',
    '/kingdom-lens',
    '/kingdom-voice',
    '/privacy',
    '/terms',
    '/ai-bots/sales-assistant',
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
           http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
     ${pages
       .map((page) => {
         return `
       <url>
         <loc>${baseUrl}${page}</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <changefreq>weekly</changefreq>
         <priority>${page === '' ? '1.0' : '0.8'}</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function SiteMap() {
  return null;
}

