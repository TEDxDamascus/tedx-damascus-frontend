import _ from 'lodash';
import { defaultLocaleValue } from '../../../../shared-components/locale-input';

const BlogModel = (data) =>
  _.defaults(data || {}, {
    id: _.uniqueId('blog-'),
    slug: defaultLocaleValue(),
    status: 'draft',
    category: '',
    read_time: 0,
    related_blogs: [],
    blog_image: '',
    gallery: [],
    title: defaultLocaleValue(),
    description: defaultLocaleValue(),
    content: defaultLocaleValue(),
    meta_title: defaultLocaleValue(),
    meta_description: defaultLocaleValue(),
    meta_keywords: defaultLocaleValue(),
    canonical_url: '',
    og_image: '',
    og_title: defaultLocaleValue(),
    og_description: defaultLocaleValue(),
    twitter_title: defaultLocaleValue(),
    twitter_description: defaultLocaleValue(),
    twitter_image: '',
    twitter_card: 'summary_large_image',
  });

export default BlogModel;
