import ws from '../lib/ws';
import Group from './Group';
import Modal from 'react-modal';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import JoinGroup from '../components/JoinGroup';
import GroupIcon from '../components/GroupIcon';
import CreateForm from '../components/CreateForm';
import { addGroup } from '../lib/reducers/groups';
import { useAppDispatch, useAppSelector } from '../lib/hooks';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [showGroup, setShowGroup] = useState('');
  const dispatch = useAppDispatch();

  const group = useAppSelector(state => state.groups.value);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      ws.registerListener(event => {
        const groupData = JSON.parse(event.data);
        if (groupData.data) dispatch(addGroup(groupData.data));
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
            <ul className="space-y-2">
              {group
                .filter(g => (searchKey ? g.name.toLowerCase().startsWith(searchKey) : true))
                .map(group => {
                  return (
                    <li key={group.id}>
                      <button className="text-lg w-full">
                        {/* TODO: Get recent message from the message array in the group */}
                        <GroupIcon
                          id={group.id}
                          name={group.name}
                          lastMsg={group.messages?.[group.messages.length - 1]?.text}
                          onClick={() => setShowGroup(group.id)}
                        />
                      </button>
                    </li>
                  );
                })}
            </ul>
            {/* New Group Modal */}
            <div className="flex justify-between mx-2 mt-5">
              <button onClick={() => setIsOpen(true)} className="btn">
                Create Group
              </button>
              <button onClick={() => setJoinOpen(true)} className="btn">
                Join Group
              </button>
            </div>
            <div className="flex justify-center">
              {/* Modal background (Shared across both modals) */}
              <Modal
                ariaHideApp={false}
                isOpen={isOpen || joinOpen}
                onRequestClose={() => {
                  setIsOpen(false);
                  setJoinOpen(false);
                }}
                style={{
                  content: {
                    border: 'none',
                    backgroundColor: 'black',
                    width: 'max-content',
                    height: 'max-content',
                    top: '30%',
                    left: '40%'
                  },
                  overlay: {
                    backgroundColor: 'rgb(0, 0, 30, 0.8)'
                  }
                }}
              >
                {isOpen && <CreateForm close={() => setIsOpen(false)} />}
                {joinOpen && <JoinGroup close={() => setJoinOpen(false)} />}
              </Modal>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray-800">
          {!showGroup && (
            <div className="p-4">
              <h1 className="text-3xl font-bold mb-4">Welcome to OneChat!</h1>
              <p>This is the content area where the chat will be displayed.</p>
            </div>
          )}
          {showGroup && <Group id={showGroup} />}
        </div>
      </div>
    </>
  );
}
