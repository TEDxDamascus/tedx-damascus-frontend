export interface LocalizedString {
  ar: string;
  en: string;
}

export interface LocalizedArray {
  ar: string[];
  en: string[];
}

export interface ImageObject {
  _id: string;
  basename: string;
  url: string;
  format: string;
  size: number;
  is_active: boolean;
  createdAt: string;
  __v: number;
}

export interface BlogSEO {
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  canonical_url: string;
  og_image: string | ImageObject | null;
  og_title: string;
  og_description: string;
}

export interface BlogJsonLd {
  '@context': string;
  '@type': string;
  inLanguage: string;
  mainEntityOfPage: string;
  url: string;
  headline: string;
  description: string;
  image: string | null;
  author: {
    '@type': string;
    name: string;
  };
  datePublished: string;
  dateModified: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RelatedBlog {
  id: string;
  title: string;
  slug?: string;
}

export interface Blog {
  _id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  status: string;
  views_count: number;
  read_time: number;
  blog_image?: ImageObject | null;
  og_image?: ImageObject | null;
  gallery: string[];
  related_blogs_ids: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  category_id?: Category;
  user_id?: string;
  user_name?: string | null;
  author?: any;
  references: any[];
  prev_blog?: RelatedBlog | null;
  next_blog?: RelatedBlog | null;
  seo: BlogSEO;
  json_ld: BlogJsonLd;
  meta_title?: LocalizedString;
  meta_description?: LocalizedString;
  meta_keywords?: LocalizedArray;
  og_title?: LocalizedString;
  og_description?: LocalizedString;
  canonical_url?: string;
}

export interface BlogsQueryParams {
  page?: number;
  limit?: number;
  lang?: string;
  status?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  category?: string;
}

export interface BlogsResponseMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Blog[];
  meta?: BlogsResponseMeta;
}

export interface CategoriesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Category[];
}

export interface BlogResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Blog;
}
