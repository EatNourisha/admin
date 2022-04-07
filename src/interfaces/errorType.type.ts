type ErrorType = {
  id?: string | null;
  message?: string | null;
  status?: number | string | null;
  action?: {
    type: string;
    payload: any;
  } | null;
  showUser?: boolean;
  [key: string]: any;
};

export default ErrorType;
