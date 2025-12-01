export type Warehouse = {
  id: string;
  warehouse: string;
  location: string;
  workers: number;
  created_at: string | number | Date;
} | null;

export interface AddWarehouseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onWarehouseAdded?: () => void;
}

export interface EditWarehouseDialogProps {
  warehouse: Warehouse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface Warehouses {
  warehouse: string;
  location: string;
}
