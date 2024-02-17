import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription
} from './ui/alert-dialog';

export default function LogoutAlert() {
  const navigate = useNavigate();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link" className="hover:bg-gray-600 text-primary-foreground">
          <LogOut className="mx-2" />
          Logout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-slate-800 text-primary-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout? You will need to log back in to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-black hover:bg-slate-300">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-slate-900 hover:bg-slate-500"
            onClick={() => {
              localStorage.clear(); 
              // Clear the redux state later
              navigate(0); // Refreshes the page
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
