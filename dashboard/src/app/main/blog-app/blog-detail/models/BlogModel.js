import _ from 'lodash';
import { defaultLocaleValue } from '../../../../shared-components/locale-input';

const BlogModel = (data) =>
  _.defaults(data || {}, {
    id: _.uniqueId('blog-'),
    title: defaultLocaleValue(),
    slug: defaultLocaleValue(),
    description: defaultLocaleValue(),
    content: defaultLocaleValue(),
    status: 'draft',
    publishedAt: null,
    category: '',
    views_count: 0,
    read_time: 0,
    blog_image: '',
    og_image: '',
    gallery: [],
    meta_title: defaultLocaleValue(),
    meta_description: defaultLocaleValue(),
    meta_keywords: defaultLocaleValue(),
    canonical_url: '',
    og_title: defaultLocaleValue(),
    og_description: defaultLocaleValue(),
    // Frontend-only fields (ask backend to add):
    related_blogs: [],
    twitter_title: defaultLocaleValue(),
    twitter_description: defaultLocaleValue(),
    twitter_image: '',
    twitter_card: 'summary_large_image',
  });

export default BlogModel;
