import axios from 'axios';
// import { useRouter } from 'next/router';
import { RespostaBackEnd } from 'types-nora-api';
import * as dotenv from 'dotenv';

const url = process.env.BACKEND_URL;

axios.defaults.withCredentials = true;

const apiClient = axios.create({
  baseURL: 'http:///localhost:3100',
  // baseURL: 'https://back.universodomedo.com',
  // baseURL: url,
  withCredentials: true,
});

apiClient.interceptors.request.use(request => {
  console.log('Enviando Requisição:', {
    url: request.url,
    method: request.method,
    data: request.data,
    params: request.params,
    headers: request.headers,
  });
  return request;
}, error => {
  console.error('Erro na requisição:', error);
  return Promise.reject(error);
});

// Interceptor de resposta para logar as respostas
apiClient.interceptors.response.use(response => {
  console.log('Recebendo Resposta:', {
    status: response.status,
    data: response.data,
  });
  response.data = convertDates(response.data);
  return response;
}, error => {
  // console.error('Erro na resposta:', error);
  return Promise.reject(error);
});

// apiClient.interceptors.response.use(response => {
//   response.data = convertDates(response.data);
//   return response;
// }, error => {
//   // if (error.response && error.response.status === 401) {
//   //   const router = useRouter();
//   //   router.push('/acessar');
//   // }
//   return Promise.reject(error);
// });

function convertDates(data: any): any {
  if (data === null || data === undefined) { return data; }

  if (typeof data === 'string' && isIsoDateString(data)) { return new Date(data); }

  if (Array.isArray(data)) { return data.map(convertDates); }

  if (typeof data === 'object') {
    const newData: any = {};
    for (const key of Object.keys(data)) { newData[key] = convertDates(data[key]); }

    return newData;
  }

  return data;
}

function isIsoDateString(value: any): boolean {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  return isoDateRegex.test(value);
}

export default async function useApi<T>({ uri, method, data, params }: { uri: string; method: 'GET' | 'POST' | 'PUT' | 'DELETE'; data?: any; params?: any; }): Promise<RespostaBackEnd<T>> {
  try {
    return (await apiClient.request<RespostaBackEnd<T>>({ url: uri, method, data, params })).data;
  } catch (error) {
    if (axios.isAxiosError(error)) return { sucesso: false, erro: error.response?.data?.message || "Erro na requisição à API." };

    else if (error instanceof Error) return { sucesso: false, erro: error.message || "Erro inesperado ao fazer a requisição." };

    else return { sucesso: false, erro: "Erro desconhecido ao fazer a requisição." };
  }
};