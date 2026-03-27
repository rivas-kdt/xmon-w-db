"use client";

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
import { Loader2 } from "lucide-react";
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
  warehouse_id: string;
}

export function EditInventoryDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: {
  item: Inventory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const t = useTranslations("editInventory");

  const { formData, isLoading, handleUpdate, handleChange } = useEditInventory(
    onSuccess,
    () => onOpenChange(false),
    item
  );

  const { warehouses } = useWarehouses();

  if (!item) return null;

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
              onChange={(e) => handleChange("product_code", e.target.value)}
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
              onChange={(e) => handleChange("stock_no", e.target.value)}
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
              onChange={(e) => handleChange("description", e.target.value)}
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
              onChange={(e) => handleChange("quantity", e.target.value)}
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
                onValueChange={(value) => handleChange("warehouse_id", value)}
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
