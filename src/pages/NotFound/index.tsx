import React from 'react';
import styles from './NotFound.module.scss';

interface NotFoundProps {}

export const NotFound: React.FC<NotFoundProps> = () => {
  return <div className={styles.notFound}>Page not found</div>;
};
