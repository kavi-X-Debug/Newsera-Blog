import { getAllPosts } from '@/lib/posts';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const baseUrl = 'https://newsera.blog';

  const categoryToPath = (category: string) => {
    switch (category) {
      case 'Cybersecurity': return 'cybersecurity';
      case 'Tech': return 'tech';
      case 'Sports News': return 'sports';
      case 'Business / Economic News': return 'business';
      case 'Political News': return 'politics';
      case 'Science & Technology News': return 'science';
      default: return 'tech';
    }
  };

  const postEntries = posts.map((post) => {
    const segment = categoryToPath(post.category);
    return {
      url: `${baseUrl}/${segment}/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/tech`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cybersecurity`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sports`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/business`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/politics`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/science`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    ...postEntries,
  ];
}
