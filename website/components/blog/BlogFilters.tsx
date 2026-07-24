'use client';

import { Search } from 'lucide-react';
import type { BlogFiltersProps } from './types';
import { CustomSelect } from './CustomSelect';

export function BlogFilters({
  isRtl,
  searchValue = '',
  selectedCategory = 'all',
  selectedLanguage = 'english',
  categories = [],
  onSearchChange,
  onCategoryChange,
  onLanguageChange,
}: BlogFiltersProps) {
  const LANGUAGES = [
    { value: 'english', label: isRtl ? 'الإنجليزية' : 'English' },
    { value: 'arabic', label: isRtl ? 'العربية' : 'Arabic' },
  ];
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onSearchChange?.(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    onCategoryChange?.(value);
  };

  const handleLanguageChange = (value: string) => {
    onLanguageChange?.(value);
  };

  const categoryOptions = [
    {
      value: 'all',
      label: isRtl ? 'جميع الفئات' : 'Category:All',
    },
    ...categories.map((cat: { _id: string; name: string }) => ({
      value: cat._id,
      label: cat.name,
    })),
  ];

  return (
    <div
      className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6 font-helvetica"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Search */}
      <div className="relative flex-1 w-full md:max-w-[572px]">
        <Search
          size={18}
          className={`absolute top-1/2 -translate-y-1/2 text-primary ${
            isRtl ? 'right-4' : 'left-4'
          }`}
        />

        <input
          type="text"
          placeholder={
            isRtl ? 'ابحث في المدونات...' : 'Search blogs...'
          }
          value={searchValue}
          onChange={handleSearchChange}
          className={`
            h-14
            w-full
            rounded-xl
            bg-card-bg
            ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'}
            text-white
            placeholder:text-gray-400
            border
            border-gray-700
            outline-none
            transition-all
            duration-200
            focus:border-primary
            focus:ring-2
            focus:ring-primary/30
          `}
        />
      </div>

      {/* Category */}
      <div className="w-full md:w-[250px]">
        <CustomSelect
          value={selectedCategory}
          onChange={handleCategoryChange}
          options={categoryOptions}
          placeholder={isRtl ? 'جميع الفئات' : 'All Categories'}
          isRtl={isRtl}
        />
      </div>

      {/* Language */}
      <div className="w-full md:w-[250px]">
        <CustomSelect
          value={selectedLanguage}
          onChange={handleLanguageChange}
          options={LANGUAGES}
          placeholder={isRtl ? 'جميع اللغات' : 'All Languages'}
          isRtl={isRtl}
        />
      </div>
    </div>
  );
}