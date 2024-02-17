export type ApiError<T extends string = string> = {
  errors: {
    param: T;
    code: string;
    message: string;
  }[];
};
