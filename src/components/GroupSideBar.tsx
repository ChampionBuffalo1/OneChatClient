import debounce from 'debounce';
import { Input } from './ui/input';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import LoggedInUser from './LoggedInUser';
import { Separator } from './ui/separator';
import { useAppSelector } from '@/lib/hooks';
import { ScrollArea } from './ui/scroll-area';
import { useCallback, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

type ISideBar = {
  selectHandler: (groupId: string) => void;
};

export default function GroupSidebar({ selectHandler }: ISideBar) {
  const [searchKey, setSearchKey] = useState('');
  const groups = useAppSelector(state => state.groups.value);
  const onChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchKey(event.target.value);
    },
    [setSearchKey]
  );

  return (
    <div className="w-[18%] border-r-[1px] border-r-gray-100 overflow-hidden">
      <nav className="flex-1 py-2">
        <>
          <LoggedInUser />
          <div className="flex items-center gap-2 px-4 mt-4 text-primary">
            <Button className="flex-1" variant="secondary">
              Join Group
            </Button>
            <Button className="flex-1" variant="secondary">
              <Plus className="mr-2" size={18} /> Create Group
            </Button>
          </div>
          <div className="px-2 mt-4">
            <Input
              className="w-full"
              placeholder="Search groups"
              type="search"
              onChange={debounce(onChangeHandler, 400)}
            />
          </div>
        </>
        <div className="mt-4 overflow-y-auto max-h-[82vh]">
          <ScrollArea>
            {groups
              .filter(group => group.name.includes(searchKey))
              .map(group => (
                <div
                  key={group.id}
                  className="hover:cursor-pointer hover:bg-gray-500"
                  onClick={() => selectHandler(group.id)}
                >
                  <div className="p-2 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={group.icon} />
                      <AvatarFallback className="bg-[#d7a3ff] text-[#5f129b] text-lg">
                        {group.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="font-medium">{group.name}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{group.description || ''}</p>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-0" />
                </div>
              ))}
          </ScrollArea>
        </div>
      </nav>
    </div>
  );
}
