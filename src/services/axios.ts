import _axios from 'axios';

export const axios = _axios.create({
  baseURL: 'http://localhost:3001/', // TODO подставлять baseURL в зависимости от режима разработки
});
