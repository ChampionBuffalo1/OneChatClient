import { z } from 'zod';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '../lib/api';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthenticationProps } from '../pages/Authentication';
import { Input, Button, Form, FormItem, FormLabel, FormField, FormControl, FormMessage } from '@/components/ui';

const formSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: 'Username must be at least 1 characters.'
    })
    .max(64, 'Username should not exceed 64 characters limit.'),
  password: z.string().min(8, 'Password must be at least 8 characters.')
});

export default function AuthorizationForm({ type }: AuthenticationProps) {
  const [credError, setCredError] = useState<string>('');
  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const navigate = useNavigate();
  const mutation = useMutation({
    mutationKey: [type],
    mutationFn: async ({ username, password }: formSchema) => {
      const { data } = await axiosInstance.post(
        '/auth/' + type,
        JSON.stringify({
          username,
          password
        })
      );
      return data;
    },
    onSuccess: (data: Omit<ApiResponse, 'errors'>) => {
      localStorage.setItem('token', data.content.meta.access_token);
      localStorage.setItem('user', JSON.stringify(data.content.data));
      navigate('/home');
    },
    onError: (error: AxiosError<Omit<ApiResponse, 'content'>>) => {
      if (error.message === 'Network Error') {
        toast.error('Network Error!');
        return;
      }
      if (!error.response) return;
      const isRootError = error.response.data.errors.find(err => !err.param);
      if (isRootError) {
        // TODO: Figure out why the message still contains quotes
        setCredError(isRootError.message.replaceAll("'", ''));
        return;
      }
      for (const err of error.response.data.errors) {
        form.setError(err.param, { message: err.message });
      }
    }
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      const username = values.username,
        password = values.password;

      mutation.mutateAsync({
        username,
        password
      });
    },
    [mutation]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  required
                  type="text"
                  id="username"
                  autoComplete="text"
                  placeholder="Username"
                  disabled={mutation.isPending}
                  className="bg-zinc-700 border-gray-600 focus:border-blue-700"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  required
                  id="password"
                  type="password"
                  placeholder="Password"
                  disabled={mutation.isPending}
                  className="bg-zinc-700 border-gray-600 focus:border-blue-700"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <label htmlFor="error" className="text-sm text-red-500">
          {credError}
        </label>
        <Button
          type="submit"
          className="btn btn-primary bg-blue-700 hover:bg-blue-800 w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending && <span className="loading loading-spinner"></span>}
          {type === 'login' ? 'Login' : 'Signup'}
        </Button>
      </form>
    </Form>
  );
}

type formSchema = z.infer<typeof formSchema>;
// the errors and content fields are mutually exclusive
type ApiResponse = {
  content: {
    data: {
      id: string;
      username: string;
      createdAt: string;
      avatarUrl: string | null;
    };
    meta: {
      access_token: string;
    };
  };
  errors: {
    param: 'username' | 'password';
    code: string;
    message: string;
  }[];
};
