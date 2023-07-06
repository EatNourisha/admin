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

  console.log("Auth", auth);

  const getHeaders = () => {
    if (auth?.isSignedIn && auth?.token)
      return {
        "device-id": "29a1df4646cb3417c19994a59a3e022a",
        role: "admin",
        authorization: `Bearer ${auth?.token}`,
      };

    return {
      "device-id": "29a1df4646cb3417c19994a59a3e022a",
      role: "admin",
    };
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

export const download = <T extends any>(
  url: string,
  progressCallback?: (progress: number) => void
) =>
  makeRequest<any, T>({
    url,
    method: "GET",
    onDownloadProgress(progressEvent) {
      const progress = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100
      );
      progressCallback && progressCallback(progress);
    },
  }).then((r: AxiosResponse<T, any>) => r.data);

export default makeRequest;
