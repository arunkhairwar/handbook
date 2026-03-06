export type ApiError = {
  message: string;
  statusCode: number;
  error?: string;
  details?: Record<string, string[]>;
  phone?: string;
  code?: string;
};

export type ValidationError = {
  field: string;
  message: string;
};
