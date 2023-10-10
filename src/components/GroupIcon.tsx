import { Users } from 'lucide-react';

interface GroupIconProps {
  icon?: string;
  name: string;
  recentMessage?: string;
}
const RECENT_LIMIT = 20;

export default function GroupIcon({ icon, name, recentMessage }: GroupIconProps) {
  return (
    <div className="flex items-center p-4 space-x-2 border-b">
      <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white">
        {icon ? <img src={icon} alt="Group Icon" className="w-6 h-6" /> : <Users />}
      </div>
      <div>
        <div className="flex items-center mx-2">
          <h2 className="text-md font-semibold">{name}</h2>
        </div>
        {recentMessage && (
          <p className="text-gray-400 mx-2">
            {recentMessage.substring(0, RECENT_LIMIT) + (recentMessage.length > RECENT_LIMIT ? '...' : '')}
          </p>
        )}
      </div>
    </div>
  );
}
