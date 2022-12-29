import ReactDOM from 'react-dom/client';
import ru_RU from 'antd/locale/ru_RU';
import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import { router } from './router';

import './shared/scss/main.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ConfigProvider locale={ru_RU}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>,
);
