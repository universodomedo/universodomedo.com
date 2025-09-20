import axios from "axios";
import { redirect } from "next/navigation";
import { obtemCookiesNoServidor } from "Uteis/ObtemCookies/ObtemCookiesNoServidor";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

apiClient.interceptors.response.use(
  (response) => {
    response.data = convertDates(response.data);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function convertDates(data: any): any {
  if (data === null || data === undefined) return data;

  if (typeof data === "string" && isIsoDateString(data)) return new Date(data);

  if (Array.isArray(data)) return data.map(convertDates);

  if (typeof data === "object") {
    const newData: any = {};
    for (const key of Object.keys(data)) {
      newData[key] = convertDates(data[key]);
    }

    return newData;
  }

  return data;
}

function isIsoDateString(value: any): boolean {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  return isoDateRegex.test(value);
}

export default async function useApi<T>({ uri, method, data, params }: { uri: string; method: "GET" | "POST" | "PUT" | "DELETE"; data?: any; params?: any }): Promise<T> {
  try {
    const config = { url: uri, method, data, params, withCredentials: true };

    if (typeof window === "undefined") {
      const cookieHeader = await obtemCookiesNoServidor();
      Object.assign(config, { headers: { Cookie: cookieHeader } });
    }

    const response = await apiClient.request<T>(config);

    // VALIDANDO RETORNO DE OBJETO NULL
    if (response.data === '' || response.data === undefined) return null as T;

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        if (typeof window === "undefined") {
          redirect("/acessar");
        } else {
          window.location.href = "/acessar";
        }
      }

      throw new Error(error.response?.data?.message || error.message || "Erro ao fazer a requisição à API.");
    }

    if (error instanceof Error) throw new Error(error.message);

    throw new Error("Erro desconhecido ao fazer a requisição.");
  }
}