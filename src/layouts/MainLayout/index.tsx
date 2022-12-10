import React from 'react';
import styles from './MainLayout.module.scss';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import { Header } from '@/components';

interface MainLayoutProps {}

export const MainLayout: React.FC<MainLayoutProps> = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <Outlet />
      <ScrollRestoration />
    </div>
  );
};
