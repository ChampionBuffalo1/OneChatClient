import DisplayError from './Error';
import { useCallback } from 'react';
import { axiosInstance } from '../lib/api';
import { AxiosStatusError } from '../typings';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AuthenticationProps } from '../pages/Authentication';

export default function AuthForm({ type }: AuthenticationProps) {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationKey: [type],
    mutationFn: async ({ username, password }: MutationFnParam) => {
      const { data } = await axiosInstance.post<ReturnObj>(
        '/' + type,
        JSON.stringify({
          username,
          password
        })
      );
      return data;
    },
    onSuccess: data => {
      const { token } = data;
      localStorage.setItem('token', token);
      navigate('/home');
    }
  });

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // @ts-ignore: Required field on the form
      const username: string = event.target.username.value;
      // @ts-ignore: Required field on the form
      const password: string = event.target.password.value;

      mutation.mutateAsync({
        username,
        password
      });
    },
    [mutation]
  );

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <label htmlFor="username">Username</label>
            {mutation.isError &&
              ((mutation.error as AxiosStatusError).response?.data.code === 19 ||
                (mutation.error as AxiosStatusError).response?.data.code === 22) && (
                <DisplayError message={(mutation.error as AxiosStatusError).response?.data.message} />
              )}
            <input
              className="input bg-zinc-800 border-gray-600 w-full focus:border-blue-700"
              id="username"
              placeholder="coolguy"
              type="text"
              autoComplete="text"
              disabled={mutation.isPending}
              required
            />
            <label htmlFor="password">Password</label>
            {mutation.isError && (mutation.error as AxiosStatusError).response?.data.code === 17 && (
              <DisplayError message={(mutation.error as AxiosStatusError).response?.data.message} />
            )}

            {/* Zod Scheam Error */}
            {mutation.isError && (mutation.error as AxiosStatusError).response?.data.code === 204 && (
              <DisplayError message={(mutation.error as AxiosStatusError).response?.data.message.issues[0].message} />
            )}
            <input
              className="input bg-zinc-800 border-gray-600 w-full focus:border-blue-700"
              id="password"
              type="password"
              minLength={8}
              disabled={mutation.isPending}
              required
            />
          </div>

          {mutation.isError && (mutation.error as AxiosStatusError).response?.data.scode === 500 && (
            <DisplayError message={(mutation.error as AxiosStatusError).response?.data.sname} />
          )}
          {mutation.isError && (mutation.error as Error).message === 'Network Error' && (
            <DisplayError message="Network Error" />
          )}
          <button className="btn btn-primary bg-blue-700 hover:bg-blue-800" disabled={mutation.isPending}>
            {mutation.isPending && <span className="loading loading-spinner"></span>}
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
  token: string;
}
