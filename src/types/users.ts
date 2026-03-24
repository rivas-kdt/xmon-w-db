export type Users = {
  id: string;
  username: string;
  email: string;
  role: string;
  location: string | null;
  warehouse: string | null;
  createdAt: string;
} | null;

export interface AddUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded?: () => void;
}

export interface EditUserDialogProps {
  user: Users;
  locations: { warehouse: string; id: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
