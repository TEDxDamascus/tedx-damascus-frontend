import { lazy } from 'react';

const BlogsList = lazy(() => import('./blogs-list/BlogsList'));
const BlogCategoriesList = lazy(() => import('./blog-categories/BlogCategoriesList'));
const Blog = lazy(() => import('./blog-detail/Blog'));

const BlogsAppConfig = {
  routes: [
    {
      path: '/blogs',
      children: [
        {
          path: '',
          element: <BlogsList />,
        },
        {
          path: 'categories',
          element: <BlogCategoriesList />,
        },
        {
          path: ':blogId',
          element: <Blog />,
        },
      ],
    },
  ],
};

export default BlogsAppConfig;
