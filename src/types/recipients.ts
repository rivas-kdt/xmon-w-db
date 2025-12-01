export type Recipients = {
  id: string;
  email: string;
  isActive: boolean;
  created_at: string;
};

export interface Recipient {
  id: string;
  email: string;
  created_at?: string;
}

export interface AddRecipientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
