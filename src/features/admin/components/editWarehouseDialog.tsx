"use client";

import { useEffect, useState } from "react";
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
import { useTranslations } from "next-intl";
import { EditWarehouseDialogProps, Warehouse } from "@/types/warehouse";
import { updateWarehouse } from "../services/updateWarehouse";
import { deleteWarehouse } from "../services/deleteWarehouse";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export function EditWarehouseDialog({
  warehouse,
  open,
  onOpenChange,
  onSuccess,
}: EditWarehouseDialogProps) {
  const [formData, setFormData] = useState({
    warehouse: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("editWarehouse");

  useEffect(() => {
    if (warehouse) {
      setFormData({
        warehouse: warehouse.warehouse || "",
        location: warehouse.location || "",
      });
    }
  }, [warehouse]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!warehouse) return;

    setIsLoading(true);
    try {
      await updateWarehouse(warehouse.id, {
        name: formData.warehouse,
        location: formData.location,
      });
      toast.success("Warehouse updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to update warehouse");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!warehouse) return;

    if (!confirm("Are you sure you want to delete this warehouse?")) return;

    setIsDeleting(true);
    try {
      await deleteWarehouse(warehouse.id);
      toast.success("Warehouse deleted successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete warehouse");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!warehouse) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] z-50">
        <DialogHeader>
          <DialogTitle>{t("header")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="warehouse" className="text-right">
              {t("warehouseName")}
            </Label>
            <Input
              id="warehouse"
              value={formData.warehouse}
              onChange={(e) => handleChange("warehouse", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              {t("location")}
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2 justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || isLoading}
            size="sm"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
          <Button
            type="submit"
            onClick={handleUpdate}
            disabled={isLoading || isDeleting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
