import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

const BASE_URL = 'https://newsera.blog';

function mapCategoryToPath(category: string): string {
  switch (category) {
    case 'Cybersecurity':
      return 'cybersecurity';
    case 'Tech':
      return 'tech';
    case 'Sports News':
      return 'sports';
    case 'Business / Economic News':
      return 'business';
    case 'Political News':
      return 'politics';
    case 'Science & Technology News':
      return 'science';
    default:
      return 'tech';
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/tech`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/cybersecurity`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/sports`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/business`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/politics`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/science`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const posts = getAllPosts();
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => {
    const categoryPath = mapCategoryToPath(post.category);
    return {
      url: `${BASE_URL}/${categoryPath}/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'weekly',
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...postRoutes];
}
