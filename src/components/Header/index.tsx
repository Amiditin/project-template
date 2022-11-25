import React from 'react';
import styles from './Header.module.scss';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return <div className={styles.header}>Header Component</div>;
};
