interface ApiResponse<R> {
  data?: R;
  status?: string;
  statusCode?: number;
}

export default ApiResponse;

export interface PaginatedDocument<T> {
  totalCount: number;
  data: T;
}
