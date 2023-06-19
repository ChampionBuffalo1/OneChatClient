export interface AxiosStatusError extends Error {
  response: AxiosResponse<{
    errors: {
      code: number;
      name: string;
      message?: string;
    }[];
  }>;
}
