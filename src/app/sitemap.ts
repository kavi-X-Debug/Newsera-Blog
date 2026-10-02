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
  const all = getAllPosts();
  const latest = (cat?: string) => {
    const d = (cat ? all.filter((p) => p.category === cat) : all)[0]?.date;
    return d ? new Date(d) : undefined;
  };

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: latest(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/tech`, lastModified: latest('Tech'), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/cybersecurity`, lastModified: latest('Cybersecurity'), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/sports`, lastModified: latest('Sports News'), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/business`, lastModified: latest('Business / Economic News'), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/politics`, lastModified: latest('Political News'), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/science`, lastModified: latest('Science & Technology News'), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/about`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/editorial-policy`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/corrections`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
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
