import ReactDOM from 'react-dom/client';
import ru_RU from 'antd/locale/ru_RU';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import { router } from './router';
import { store } from './redux/store';

import './shared/scss/main.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={ru_RU}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </StrictMode>,
);
