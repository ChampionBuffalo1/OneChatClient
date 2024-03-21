import { Button } from './ui/button';
import { Shield } from 'lucide-react';
import { axiosInstance } from '@/lib/api';
import { useEffect, useState } from 'react';
import PermissionForm from './PermissionForm';
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription } from './ui/dialog';

export default function PermissionDialog({
  id,
  authorId,
  permission
}: {
  id: string;
  authorId: string;
  permission: number;
}) {
  const [authorPermission, setAuthorPermission] = useState(0);

  useEffect(() => {
    if (!authorPermission) {
      axiosInstance
        .post<{ content: { data: { id: string; permissions: number } } }>(
          `/group/${id}/member/permission`,
          JSON.stringify({
            userId: authorId
          })
        )
        .then(({ data }) => {
          setAuthorPermission(data.content.data.permissions);
        });
    }
  }, [id, authorId, authorPermission, setAuthorPermission]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Shield /> Permission
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription asChild>
            <PermissionForm authorPermission={authorPermission} permission={permission} id={id} authorId={authorId} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
