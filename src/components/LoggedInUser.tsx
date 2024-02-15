import { Menu } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useAppSelector } from '@/lib/hooks';

export default function LoggedInUser() {
  const user = useAppSelector(state => state.user.data);
  return (
    <div className="flex items-center gap-2 px-4">
      <div className="rounded-full overflow-hidden w-10 h-10">
        <Avatar>
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback className="bg-[#d7a3ff] text-[#5f129b] text-lg">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1">
        <h1 className="text-sm font-semibold">{user.username}</h1>
      </div>
      <div className="hover:bg-slate-800 p-1 rounded-md">
        <Popover>
          <PopoverTrigger>
            <Menu />
          </PopoverTrigger>
          <PopoverContent className="">
            <div className="">
              <span>Okay</span>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
