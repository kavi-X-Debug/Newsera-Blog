import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/search', '/post/'],
      },
    ],
    sitemap: ['https://newsera.blog/sitemap.xml', 'https://newsera.blog/news-sitemap.xml'],
    host: 'https://newsera.blog',
  };
}
