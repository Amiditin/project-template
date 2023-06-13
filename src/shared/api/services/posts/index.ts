import { axios } from '@/shared/api/axios';
import { apiRoutes } from '@/shared/api/apiRoutes';

import type { IPostsService } from './types';

const postsRoute = apiRoutes.root;

export const postsService: IPostsService = {
  findAll: (_, config) => {
    return axios.get(postsRoute, config);
  },
  findById: async ({ id }, config) => {
    return axios.get(`${postsRoute}/${id}`, config);
  },
  create: async (params, config) => {
    return axios.post(postsRoute, params, config);
  },
  update: async ({ id, ...params }, config) => {
    return axios.patch(`${postsRoute}/${id}`, params, config);
  },
  remove: async ({ id }, config) => {
    return axios.delete(`${postsRoute}/${id}`, config);
  },
};
