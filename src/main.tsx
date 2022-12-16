import React from 'react';
import ReactDOM from 'react-dom/client';
import ru_RU from 'antd/locale/ru_RU';
import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import { router } from './router';
import { store } from './redux/store';

import './shared/scss/main.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={ru_RU}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ConfigProvider>
  </React.StrictMode>,
);
