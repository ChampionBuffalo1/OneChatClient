import ws from '../lib/ws';
import Group from './Group';
import Modal from 'react-modal';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import GroupIcon from '../components/GroupIcon';
import GroupForm from '../components/GroupForm';
import { addGroup } from '../lib/reducers/groups';
import { useAppDispatch, useAppSelector } from '../lib/hooks';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const group = useAppSelector(state => state.groups.value);
  const [searchKey, setSearchKey] = useState('');
  const [showGroup, setShowGroup] = useState('');
  const dispatch = useAppDispatch();

  const data = useAppSelector(state => state.groups.value);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      ws.registerListener(event => {
        const g = JSON.parse(event.data);
        if (g.data) dispatch(addGroup(g.data.Group));
      }, token);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>OneChat</title>
      </Helmet>
      <div className="flex h-screen bg-slate-950">
        <div className="lg:w-1/6 min-w-fit justify-center text-center">
          <div className="pt-4">
            <input
              type="text"
              className="input mx-2 max-w-sm lg:max-w-lg rounded-md mb-4 focus:ring-blue-500 focus:ring-1"
              placeholder="Search"
              value={searchKey}
              onChange={event => setSearchKey(event.target.value)}
            />
            <ul className="space-y-4">
              {group
                .filter(g => (searchKey ? g.name.toLowerCase().startsWith(searchKey) : true))
                .map(group => (
                  <li key={group.id}>
                    <button
                      className="space-x-2 text-lg"
                      onClick={() => {
                        setShowGroup(group.id);
                      }}
                    >
                      <GroupIcon name={group.name} recentMessage="Loading..." />
                    </button>
                  </li>
                ))}
            </ul>
            {/* New Group Modal */}
            <button onClick={() => setIsOpen(true)}>New Group</button>
            <div className="flex justify-center">
              <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                contentLabel="New Group"
                style={{
                  content: {
                    width: 'max-content',
                    height: 'max-content',
                    top: '30%',
                    left: '40%',
                    background: 'white'
                  },
                  overlay: {
                    opacity: '0.8',
                    backgroundColor: 'gray'
                  }
                }}
              >
                <GroupForm close={() => setIsOpen(false)} />
              </Modal>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 bg-gray-800">
          <pre>{JSON.stringify(data, undefined, 2)}</pre>
          {!showGroup && (
            <>
              <h1 className="text-3xl font-bold mb-4">Welcome to the Chat Application!</h1>
              <p>This is the content area where the chat will be displayed.</p>
            </>
          )}
          {showGroup && <Group id={showGroup} />}
        </div>
      </div>
    </>
  );
}
