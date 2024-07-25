import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3030/api/',
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

export async function useApi<T>(uri: string, params?: {}): Promise<T> {
  const response = await apiClient.get<T>(uri, { params });

  return response.data as T;
}

export default useApi;