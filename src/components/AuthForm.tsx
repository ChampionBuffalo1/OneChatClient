import { useCallback } from 'react';
import { useAppDispatch } from '../lib/hooks';
import { useMutation } from '@tanstack/react-query';
import { setToken } from '../lib/reducers/token';
import { AuthenticationProps } from '../pages/Authentication';
import { axiosInstance } from '../lib/api';
import { AxiosStatusError } from '../typings';
import DisplayError from './Error';


const userErrCode = [17, 19, 22];

export default function AuthForm({ type }: AuthenticationProps) {
  const dispatch = useAppDispatch();
  const mutation = useMutation({
    mutationKey: [type],
    mutationFn: async ({ username, password }: MutationFnParam) => {
      const { data } = await axiosInstance.post<ReturnObj>('/' + type, {
        username,
        password
      });
      return data;
    },
    onSuccess: data => {
      const { token } = data.results[0];
      dispatch(setToken(token));
      localStorage.setItem('token', token);
    }
  });

  const onSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // @ts-ignore: Required field on the form
    const username: string = event.target.username.value;
    // @ts-ignore: Required field on the form
    const password: string = event.target.password.value;
    
    mutation.mutateAsync({
      username,
      password
    });
  }, []);

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <label htmlFor="username">Username</label>
            {mutation.isError &&
              userErrCode.includes((mutation.error as AxiosStatusError).response?.data.errors[0].code) && (
                <DisplayError message={(mutation.error as AxiosStatusError).response.data.errors[0].name} />
              )}
            <input
              className="input bg-zinc-800 border-gray-600 w-full focus:border-blue-700"
              id="username"
              placeholder="coolguy"
              type="text"
              autoComplete="text"
              disabled={mutation.isLoading}
              required
            />
            <label htmlFor="password">Password</label>
            {mutation.isError && (mutation.error as AxiosStatusError).response?.data.errors[0].code === 17 && (
              <DisplayError message={(mutation.error as AxiosStatusError).response.data.errors[0].name} />
            )}
            {/* Zod Scheam Error */}
            {mutation.isError && (mutation.error as AxiosStatusError).response?.data.errors[0].code === 204 && (
              <DisplayError
                message={(mutation.error as AxiosStatusError).response.data.errors[0].name.issues[0].message}
              />
              )}
            <input
              className="input bg-zinc-800 border-gray-600 w-full focus:border-blue-700"
              id="password"
              type="password"
              minLength={8}
              disabled={mutation.isLoading}
              required
            />
          </div>

          {mutation.isError && (mutation.error as AxiosStatusError).response?.data.errors[0].code === 500 && (
            <DisplayError message={(mutation.error as AxiosStatusError).response.data.errors[0].name} />
          )}
          {mutation.isError && (mutation.error as Error).message === 'Network Error' && (
            <DisplayError message="Network Error" />
          )}
          <button className="btn btn-primary bg-blue-700 hover:bg-blue-800" disabled={mutation.isLoading}>
            {mutation.isLoading && <span className="loading loading-spinner"></span>}
            {type === 'login' ? 'Login' : 'Signup'}
          </button>
        </div>
      </form>
    </div>
  );
}

type MutationFnParam = {
username: string;
password: string;
};

interface ReturnObj {
results: { success: boolean; token: string }[];
}