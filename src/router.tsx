import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { MainLayout, MainErrorBoundary } from './layouts';
import { Home, NotFound } from './pages';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />} errorElement={<MainErrorBoundary />}>
      <Route index element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);
