import { useState, useEffect, useCallback } from 'react';
import { blogsService } from '../api/blogs.service';
import { Blog, BlogsQueryParams, BlogsResponse, Category } from '../api/blogs.types';

export const useBlogs = (params?: BlogsQueryParams) => {
  const [data, setData] = useState<BlogsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await blogsService.getBlogs(params);
      setData(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { data, isLoading, error, refetch: fetchBlogs };
};

export const useBlogBySlug = (slug: string, locale: string = 'en') => {
  const [data, setData] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await blogsService.getBlogBySlug(slug, locale);
        setData(response);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [slug, locale]);

  return { data, isLoading, error };
};

export const useRelatedBlogs = (ids: string[], locale: string = 'en') => {
  const [data, setData] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ids || ids.length === 0) {
      setIsLoading(false);
      setData([]);
      return;
    }

    const fetchRelatedBlogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await blogsService.getRelatedBlogs(ids, locale);
        setData(response);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedBlogs();
  }, [ids, locale]);

  return { data, isLoading, error };
};

export const useCategories = (lang: string = 'en') => {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await blogsService.getCategories(lang);
      setData(response);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { data, isLoading, error, refetch: fetchCategories };
};
