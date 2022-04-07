import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

import configs from "config";
import ls from "utils/secureStorage";

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  function (error: AxiosError<any>) {
    const errorData = {
      ...error?.response?.data,
    };
    return Promise.reject(errorData);
  }
);

const makeRequest = <D extends any = any, R extends any = any>(
  config: AxiosRequestConfig<D>
) => {
  const auth = ls.get(configs.authKey);

  const getHeaders = () => {
    if (auth?.isSignedIn && auth?.token)
      return {
        authorization: `Bearer ${auth?.token}`,
      };

    return {};
  };

  return axios.request<R>({
    baseURL: configs.baseUrl,
    headers: { ...(getHeaders() as any) },
    ...config,
  });
};

export const get = <T extends any>(url: string) =>
  makeRequest<any, T>({ url, method: "GET" }).then(
    (r: AxiosResponse<T, any>) => r.data
  );

export const post = <T extends any, D extends any>(url: string, data: D) =>
  makeRequest<any, T>({ url, data, method: "POST" }).then(
    (r: AxiosResponse<T, any>) => r.data
  );

export const put = <T extends any, D extends any>(url: string, data: D) =>
  makeRequest<any, T>({ url, data, method: "PUT" }).then(
    (r: AxiosResponse<T, any>) => r.data
  );

export const destroy = <T extends any, D extends any = any>(
  url: string,
  data?: D
) =>
  makeRequest<any, T>({ url, data, method: "DELETE" }).then(
    (r: AxiosResponse<T, any>) => r.data
  );

export default makeRequest;
