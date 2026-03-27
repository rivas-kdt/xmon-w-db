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
import { useEditInventory } from "../hooks/useEditInventory";
import { useWarehouses } from "../hooks/useWarehouses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Inventory {
  lot_no: string;
  product_code: string;
  stock_no: string;
  description: string;
  warehouse: string;
  created_at: string;
  quantity: number;
}

export function EditInventoryDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: {
  item: Inventory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  console.log("Editing item:", item);
  const [formData, setFormData] = useState<Inventory>(item);
  const t = useTranslations("editInventory");

  const { isLoading, handleUpdate } = useEditInventory(onSuccess, () =>
    onOpenChange(false)
  );

  const { warehouses } = useWarehouses();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
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
          {/** SAME INPUTS — unchanged */}
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
            <Label htmlFor="warehouse_id" className="text-right">
              {t("warehouse")}
            </Label>

            <div className="col-span-3">
              <Select
                value={formData.warehouse_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    warehouse_id: parseInt(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>

                <SelectContent>
                  {warehouses.map((w) => (
                    <SelectItem key={w.id} value={w.id.toString()}>
                      {w.warehouse} ({w.location})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          {/* <Button
            variant="destructive"
            onClick={() => handleDelete(item.lot_no, t)}
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
          </Button> */}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t("cancel") || "Cancel"}
            </Button>

            <Button
              onClick={() => handleUpdate(formData, t)}
              disabled={isLoading}
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
