export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface CursorPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    pagination: {
      nextCursor: string | null;
      hasNextPage: boolean;
    };
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
