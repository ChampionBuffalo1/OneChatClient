import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '../lib/hooks';
import { axiosInstance } from '../lib/api';
import { useState } from 'react';
import { addGroup } from '../lib/reducers/groups';

interface JoinGroupProps {
  close: () => void;
}

export default function JoinGroup({ close }: JoinGroupProps) {
  const dispatch = useAppDispatch();
  const [id, setId] = useState('');
  const mutation = useMutation({
    mutationFn: async () => {
      const data = await axiosInstance.post(`/group/${id}/join/`);
      return data;
    },
    onSuccess: ({data}) => {
      dispatch(addGroup(data));
      close();
    },
    onError: err => {
      console.error(err);
    }
  });

  return (
    <div className="flex flex-col">
      <input type="text" value={id} onChange={e => setId(e.target.value)} />
      <button onClick={() => mutation.mutate()} className="m-2">
        Join Group
      </button>
    </div>
  );
}
