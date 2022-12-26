import { Outlet, ScrollRestoration } from 'react-router-dom';

import { Header } from '@/components';

import styles from './MainLayout.module.scss';

export const MainLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <Outlet />
      <ScrollRestoration />
    </div>
  );
};
