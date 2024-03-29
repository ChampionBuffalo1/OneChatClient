import debounce from 'debounce';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import LoggedInUser from './LoggedInUser';
import { Separator } from './ui/separator';
import { useAppSelector } from '@/lib/hooks';
import { ScrollArea } from './ui/scroll-area';
import GroupActionDialog from './GroupActionDialog';
import { useCallback, useRef, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

type ISideBar = {
  className?: string;
  selectHandler: (groupId: string) => void;
};

export default function GroupSidebar({ selectHandler, className }: ISideBar) {
  const [open, setOpen] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const contentKeyRef = useRef<'join' | 'create'>();

  const groups = Object.values(useAppSelector(state => state.groups.value) || '{}');
  const onChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchKey(event.target.value);
    },
    [setSearchKey]
  );

  return (
    <div className={cn('w-full lg:w-[18%] border-r-[1px] border-r-gray-100', className)}>
      <nav className="flex-1 py-2">
        <>
          <LoggedInUser />
          <div className="flex items-center gap-2 px-2 mt-4 text-primary">
            <Button
              className="w-1/2"
              variant="secondary"
              onClick={() => {
                contentKeyRef.current = 'join';
                setOpen(true);
              }}
            >
              Join Group
            </Button>
            <Button
              className="w-1/2"
              variant="secondary"
              onClick={() => {
                contentKeyRef.current = 'create';
                setOpen(true);
              }}
            >
              Create Group
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
        <div className="mt-4 max-h-[80vh] flex flex-col">
          {groups.length === 0 && <Label className="text-md"> Create or Join a group</Label>}
          <ScrollArea className="overflow-auto">
            {groups
              .filter(group => group.name.includes(searchKey))
              .map(group => (
                <div
                  key={group.id}
                  className="group hover:cursor-pointer hover:bg-gray-500"
                  onClick={() => selectHandler(group.id)}
                >
                  <div className="p-2 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={group.iconUrl} />
                      <AvatarFallback className="bg-[#d7a3ff] text-[#5f129b] text-lg">
                        {group.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="font-medium">{group.name}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-300">
                          {group.description || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-0" />
                </div>
              ))}
          </ScrollArea>
        </div>
      </nav>

      <GroupActionDialog setOpen={setOpen} open={open} status={contentKeyRef.current!} />
    </div>
  );
}
