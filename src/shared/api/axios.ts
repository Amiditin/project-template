import _axios from 'axios';
import qs from 'qs';

import { baseBackendURL } from './apiRoutes';

export const axios = _axios.create({
  baseURL: baseBackendURL,
  paramsSerializer: {
    serialize: (params) => qs.stringify(params),
  },
});
