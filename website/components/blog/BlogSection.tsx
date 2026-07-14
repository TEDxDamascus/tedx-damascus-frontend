'use client';

import { useState, useEffect } from 'react';
import { BlogFilters } from './BlogFilters';
import { BlogGrid } from './BlogGrid';
import { useCategories } from '@/lib/hooks/useBlogs';
import { blogsService } from '@/lib/api/blogs.service';
import { Blog, BlogsQueryParams } from '@/lib/api/blogs.types';
import type { BlogSectionProps } from './types';

const PAGE_LIMIT = 9;

export function BlogSection({ locale }: BlogSectionProps) {
  const isRtl = locale === 'ar';
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const { data: categories } = useCategories(locale);

  const languageParam =
    selectedLanguage === 'all'
      ? locale
      : selectedLanguage === 'english'
      ? 'en'
      : 'ar';

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const buildQuery = (pageNumber: number): BlogsQueryParams => ({
    page: pageNumber,
    limit: PAGE_LIMIT,
    lang: languageParam,
    sort: 'createdAt',
    order: 'desc',
    status: 'published',
    search: debouncedSearch || undefined,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  const fetchBlogs = async (pageNumber: number, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = buildQuery(pageNumber);
      const response = await blogsService.getBlogs(params);

      setBlogs((prev) =>
        reset ? response.data : [...prev, ...response.data]
      );

      const nextHasMore = response.meta
        ? (response.meta.page ?? pageNumber) < (response.meta.totalPages ?? pageNumber)
        : response.data.length === PAGE_LIMIT;

      setHasMore(nextHasMore);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setBlogs([]);
    fetchBlogs(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory, selectedLanguage, locale]);

  const handleLoadMore = () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchBlogs(nextPage);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
  };

  const isInitialLoading = loading && blogs.length === 0;

  return (
    <section
      className="bg-primary-container px-4 md:px-8 lg:px-[160px] py-6 font-helvetica"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto mb-8 w-full max-w-[1120px]">
        <BlogFilters
          isRtl={isRtl}
          searchValue={searchQuery}
          selectedCategory={selectedCategory}
          selectedLanguage={selectedLanguage}
          categories={categories}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      {error ? (
        <div className="mx-auto w-full max-w-[1120px] flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-gray-600 dark:text-gray-400">
            {error.message || (isRtl ? 'فشل في تحميل المدونات. حاول مرة أخرى.' : 'Failed to load blogs. Please try again.')}
          </p>
          <button
            onClick={() => fetchBlogs(1, true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {isRtl ? 'أعد المحاولة' : 'Retry'}
          </button>
        </div>
      ) : isInitialLoading ? (
        <div className="mx-auto mt-8 w-full max-w-[1120px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: PAGE_LIMIT }).map((_, index) => (
            <div
              key={index}
              className="h-[372px] w-full rounded-[20px] bg-card-bg animate-pulse"
            />
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <>
          <div className="mx-auto mt-8 w-full max-w-[1120px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogGrid blogs={blogs} isRtl={isRtl} locale={locale} />
          </div>

          {hasMore && (
            <div className="mx-auto mt-12 w-full max-w-[1120px] flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-3 bg-primary text-[#1A1A1A] h-[56px] w-[127px] text-sm font-semibold  transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (isRtl ? 'جارٍ التحميل...' : 'Loading...') : isRtl ? 'تحميل المزيد' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mx-auto w-full max-w-[1120px] flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {searchQuery
              ? isRtl
                ? 'لم يتم العثور على نتائج'
                : 'No results found'
              : isRtl
              ? 'لا توجد مدونات'
              : 'No blogs found'}
          </p>
          {(searchQuery || selectedCategory !== 'all' || selectedLanguage !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLanguage('all');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {isRtl ? 'مسح الفلاتر' : 'Clear filters'}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
