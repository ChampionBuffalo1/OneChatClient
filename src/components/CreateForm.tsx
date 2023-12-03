import { AxiosError } from 'axios';
import { axiosInstance } from '../lib/api';
import { useAppDispatch } from '../lib/hooks';
import { addGroup } from '../lib/reducers/groups';
import { useMutation } from '@tanstack/react-query';
import { FormEvent, useRef, useState } from 'react';

export default function GroupForm({ close }: { close: () => void }) {
  const name = useRef('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const mutation = useMutation({
    mutationFn: async (event: FormEvent) => {
      event.preventDefault();
      const { data } = await axiosInstance.post(
        '/group/create',
        JSON.stringify({
          name: name.current
        })
      );
      return data;
    },
    onError: (err: AxiosError) => {
      if (err.response) {
        setError((err.response.data as { message: string }).message);
      } else {
        setError(err.message);
      }
    },
    onSuccess: ({ data }) => {
      dispatch(addGroup(data));
      close();
    }
  });

  return (
    <div className="flex flex-col items-center text-white">
      <h1 className="py-8">Customize your Group</h1>
      <div className="flex items-center justify-center">
        <form method="post" onSubmit={mutation.mutateAsync} className="flex flex-col">
          <label htmlFor="name" className="label">
            Group Name
          </label>
          {error && <p className="text-red-600 text-md">Error: {error}</p>}
          <input
            required
            type="text"
            className="mx-2 my-2 input text-black text-lg bg-gray-300 outline-none"
            placeholder="name"
            onChange={event => (name.current = event.target.value)}
          />
          <div className="flex justify-between mt-4 mx-2">
            <button type="button" onClick={close}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm w-fit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
