import { lazy } from 'react';

const BlogsList = lazy(() => import('./blogs-list/BlogsList'));
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
          path: ':blogId',
          element: <Blog />,
        },
      ],
    },
  ],
};

export default BlogsAppConfig;
