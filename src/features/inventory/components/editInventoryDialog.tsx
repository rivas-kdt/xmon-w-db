"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface Inventory {
  lot_no: string;
  product_code: string;
  stock_no: string;
  description: string;
  warehouse: string;
  created_at: string;
  quantity: number;
}

interface EditInventoryDialogProps {
  item: Inventory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditInventoryDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: EditInventoryDialogProps) {
  const [formData, setFormData] = useState<Inventory>(item);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("editInventory");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v2/inventory/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update inventory");

      toast.success(t("updated") || "Inventory updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast.error((error as any).message || t("error") || "Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete") || "Are you sure you want to delete this item?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/v2/inventory/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lot_no: item.lot_no }),
      });

      if (!response.ok) throw new Error("Failed to delete inventory");

      toast.success(t("deleted") || "Inventory deleted successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error deleting inventory:", error);
      toast.error((error as any).message || t("error") || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title") || "Edit Inventory Item"}</DialogTitle>
          <DialogDescription>
            {t("description") || "Update inventory details"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lot_no" className="text-right">
              {t("lotNo")}
            </Label>
            <Input
              id="lot_no"
              name="lot_no"
              value={formData.lot_no}
              disabled
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product_code" className="text-right">
              {t("prodCode")}
            </Label>
            <Input
              id="product_code"
              name="product_code"
              value={formData.product_code}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock_no" className="text-right">
              {t("stockNo")}
            </Label>
            <Input
              id="stock_no"
              name="stock_no"
              value={formData.stock_no}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              {t("description")}
            </Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              {t("quantity")}
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="warehouse" className="text-right">
              {t("warehouse")}
            </Label>
            <Input
              id="warehouse"
              name="warehouse"
              value={formData.warehouse}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading || isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("deleting")}
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                {t("delete")}
              </>
            )}
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading || isDeleting}
            >
              {t("cancel") || "Cancel"}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || isDeleting}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("updating")}
                </>
              ) : (
                t("update") || "Update"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
