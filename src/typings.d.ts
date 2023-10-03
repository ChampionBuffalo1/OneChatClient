export interface AxiosStatusError extends Error {
  response: AxiosResponse<{
    code: number;
    message: string;
  }>;
}
