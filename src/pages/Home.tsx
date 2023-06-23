import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/api';
import { useState } from 'react';
import GroupIcon from '../components/GroupIcon';
import { Link } from 'react-router-dom';

const userGroups = [
  {
    id: 1,
    name: 'Friends',
    members: ['John', 'Jane', 'Alice']
  },
  {
    id: 2,
    name: 'Work',
    members: ['Mike', 'Sarah', 'Tom']
  },
  {
    id: 3,
    name: 'Family',
    members: ['David', 'Emily', 'Mark']
  }
];

export default function Home() {
  const [searchKey, setSearchKey] = useState<string>('');
  // const [] = useState<string>('');
  const { isLoading, data, isError, error } = useQuery(['key'], {
    queryFn: async () => (await axiosInstance.post('/@me')).data,
    retry: 3
  });

  return (
    <div className="flex h-screen bg-slate-950">
      <div className="w-1/5 justify-center text-center">
        <div className="pt-4">
          <input
            type="text"
            className="input max-w-lg rounded-md mb-4 focus:border-blue-500"
            placeholder="Search"
            value={searchKey}
            onChange={event => setSearchKey(event.target.value)}
          />
          <ul className="space-y-4">
            {userGroups
              .filter(g => (searchKey ? g.name.toLowerCase().startsWith(searchKey) : true))
              .map(group => (
                <li key={group.id}>
                  <Link to={`/group/${group.id}`} className="space-x-2 text-lg ">
                    <GroupIcon name={group.name} recentMessage="This is the greatest message" />
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="flex-1 p-4 bg-gray-800">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Chat Application!</h1>
        <p>This is the content area where the chat will be displayed.</p>
      </div>
    </div>
  );
}
