import { useState } from 'react';
import { Menu } from 'lucide-react';
import LogoutAlert from './LogoutAlert';
import { Separator } from './ui/separator';
import { useAppSelector } from '@/lib/hooks';
import UserSettingsDialog from './UserSettingsDialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

export default function LoggedInUser() {
  const [open, setOpen] = useState(false);
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
      <div className="hover:cursor-pointer hover:bg-slate-800 p-1 rounded-md" onClick={() => setOpen(true)}>
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger>
            <Menu />
          </PopoverTrigger>
          <PopoverContent className="w-40 bg-slate-900">
            <div>
              <LogoutAlert />
              <Separator className="my-2 bg-gray-400" />
              <UserSettingsDialog />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
