import React from 'react';
import styles from './NotFound.module.scss';
import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';

interface NotFoundProps {}

export const NotFound: React.FC<NotFoundProps> = () => {
  return (
    <div className={styles.notFound}>
      <Result
        className={styles.box}
        status="404"
        title="404"
        subTitle="Страница не найдена. Попробуйте найти то, что вам нужно, с главной страницы."
        extra={
          <Link to="/">
            <Button type="primary">На главную</Button>
          </Link>
        }
      />
    </div>
  );
};
