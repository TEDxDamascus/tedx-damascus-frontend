export interface BlogCardProps {
  id: string;
  title: string;
  description?: string;
  category: string;
  date: string;
  image: string;
  isRtl: boolean;
  slug?: string;
  locale?: string;
  read_time?: string | number;
}

export interface BlogFiltersProps {
  isRtl: boolean;
  searchValue?: string;
  selectedCategory?: string;
  selectedLanguage?: string;
  categories?: Array<{ _id: string; name: string }>;
  onSearchChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onLanguageChange?: (value: string) => void;
}

export interface BlogGridProps {
  blogs: BlogCardProps[];
  isRtl: boolean;
  locale?: string;
}

export interface BlogSectionProps {
  locale: string;
  blogs?: BlogCardProps[];
}
