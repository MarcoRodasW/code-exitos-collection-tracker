export interface ApiResponse<T> {
  error: string | null;
  message: string;
  succeed: boolean;
  data: T | null;
}
