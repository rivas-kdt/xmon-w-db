"use client";
import { useState } from "react";
import { updateShipmentStatus } from "../services/updateShipmentStatus";

export function useShipmentStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateStatus = async (shipmentId: string, newStatus: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await updateShipmentStatus(shipmentId, newStatus);
      setSuccess(true);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update shipment status";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading, error, success };
}
