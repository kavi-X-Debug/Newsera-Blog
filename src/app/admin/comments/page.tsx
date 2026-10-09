import type { Metadata } from 'next';
import CommentsAdmin from '@/components/comments-admin';

export const metadata: Metadata = {
  title: 'Moderate comments',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CommentsAdmin />;
}
