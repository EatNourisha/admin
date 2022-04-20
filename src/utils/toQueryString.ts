const toQueryString = (params: { [key: string]: any }) =>
  Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");

export default toQueryString;
