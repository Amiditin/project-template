import { useNavigate } from 'react-router-dom';
import { GlobalOutlined } from '@ant-design/icons';

import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      <GlobalOutlined className={styles.globalIcon} onClick={() => navigate('/')} />
    </div>
  );
};
