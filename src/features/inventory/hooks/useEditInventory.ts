"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { updateInventory } from "../services/inventoryService";

export function useEditInventory(onSuccess?: () => void, onClose?: () => void) {
  const [isLoading, setIsLoading] = useState(false);

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

  return {
    isLoading,
    handleUpdate,
  };
}
