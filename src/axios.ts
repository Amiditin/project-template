import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001/', // URL бэка
});

export default instance;
