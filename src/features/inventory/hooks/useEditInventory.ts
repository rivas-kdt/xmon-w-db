"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateInventory } from "../services/inventoryService";

export function useEditInventory(
  onSuccess?: () => void,
  onClose?: () => void,
  item?: any
) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    lot_no: item?.lot_no || "",
    product_code: item?.product_code || "",
    stock_no: item?.stock_no || "",
    description: item?.description || "",
    warehouse: item?.warehouse || "",
    warehouse_id: item?.warehouse_id || "",
    quantity: item?.quantity || 0,
    created_at: item?.created_at || "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        lot_no: item.lot_no || "",
        product_code: item.product_code || "",
        stock_no: item.stock_no || "",
        description: item.description || "",
        warehouse: item.warehouse || "",
        warehouse_id: item.warehouse_id || "",
        quantity: item.quantity || 0,
        created_at: item.created_at || "",
      });
    }
  }, [item]);

  const handleUpdate = async (formData: any, t: any) => {
    setIsLoading(true);
    try {
      await updateInventory(formData);

      toast.success(t("updated") || "Inventory updated successfully");
      onClose?.();
      onSuccess?.();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || t("error") || "Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    isLoading,
    handleUpdate,
    formData,
    handleChange,
  };
}
