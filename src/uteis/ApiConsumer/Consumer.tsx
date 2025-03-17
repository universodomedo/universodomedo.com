import axios from 'axios';
import { RespostaBackEnd } from 'types-nora-api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(response => {
  response.data = convertDates(response.data);
  return response;
}, error => {
  return Promise.reject(error);
});

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
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    return (await apiClient.request<RespostaBackEnd<T>>({ url: uri, method, data, params, withCredentials: true, headers: { Cookie: cookieHeader }, })).data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        redirect('/acessar');
      }

      return { sucesso: false, erro: error.response?.data?.message || "Erro na requisição à API." };
    }

    else if (error instanceof Error) return { sucesso: false, erro: error.message || "Erro inesperado ao fazer a requisição." };

    else return { sucesso: false, erro: "Erro desconhecido ao fazer a requisição." };
  }
};