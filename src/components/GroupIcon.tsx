import { useState } from 'react';
import { Check, Copy, Users } from 'lucide-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface GroupIconProps {
  id: string;
  icon?: string;
  name: string;
  lastMsg?: string;
  onClick?: () => void;
}
const CHAR_LIMIT = 20;

export default function GroupIcon({ id, icon, name, lastMsg, onClick }: GroupIconProps) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center p-4 space-x-2 border-b">
      <div className="flex items-center justify-center w-16 h-12 rounded-full border border-white">
        {icon ? <img src={icon} alt="Group Icon" className="w-6 h-6" /> : <Users />}
      </div>
      <div className="flex justify-between w-full" onClick={onClick}>
        <div>
          <div className="flex items-center mx-2">
            <h2 className="text-md font-semibold">{name}</h2>
          </div>
          {lastMsg && (
            <p className="text-gray-400 mx-2">
              {lastMsg.substring(0, CHAR_LIMIT) + (lastMsg.length > CHAR_LIMIT ? '...' : '')}
            </p>
          )}
        </div>
      </div>
      <CopyToClipboard
        text={id}
        onCopy={() => {
          setCopied(true);
          // Reset back to clipboard icon after 2 seconds
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? <Check className="text-green-500 cursor-default" size={26} /> : <Copy className="cursor-copy" />}
      </CopyToClipboard>
    </div>
  );
}
