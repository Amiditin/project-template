import RU from 'antd/locale/ru_RU';

import type { ConfigProviderProps } from 'antd/es/config-provider';

export const configProviderProps: ConfigProviderProps = {
  locale: RU,
  theme: {
    token: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
  },
};
