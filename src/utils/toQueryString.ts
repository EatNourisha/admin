const toQueryString = (params: { [key: string]: any }) =>
  Object.keys(params)
    .map((key) => !!params[key] && `${key}=${params[key]}`)
    .filter(Boolean) // Boolean can filter out falsy values like null, undefined or false
    .join("&");

export default toQueryString;
