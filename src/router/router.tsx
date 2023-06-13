import { createBrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from '@/components';
import { MainLayout } from '@/components/layouts';
import { HomePage, NotFoundPage } from '@/pages';

import { routes } from './routes';

export const router = createBrowserRouter([
  {
    path: routes.root.path,
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    path: routes.notFound.path,
    element: <NotFoundPage />,
  },
]);
