import { axios } from '../axios';
import { apiRoutes } from '../apiRoutes';

export const getDataRequest = () => {
  return axios.get(apiRoutes.DATA);
};
