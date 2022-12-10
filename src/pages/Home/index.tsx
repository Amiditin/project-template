import React from 'react';
import styles from './Home.module.scss';

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  return <div className={styles.home}>Home Page</div>;
};
