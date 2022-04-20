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

export interface HashedDocumentPagination<T> {
  results: T;
  previous: string;
  hasPrevious: false;
  next: string;
  hasNext: true;
}
