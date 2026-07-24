import type { BlogCardProps } from '@/components/blog/types';

export interface ArticleSidebarItem {
  label: string;
  href: string;
}

export interface AuthorProfile {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  links: Array<{ label: string; href: string }>;
}

export interface RelatedArticleCardProps extends Pick<BlogCardProps, 'id' | 'title' | 'category' | 'date' | 'image'> {
  isRtl?: boolean;
  read_time?: string | number;
}

export interface ArticlePageProps {
  locale: string;
  article: {
    category: string;
    title: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    excerpt: string;
  };
  author: AuthorProfile;
  toc: ArticleSidebarItem[];
  related: RelatedArticleCardProps[];
}
