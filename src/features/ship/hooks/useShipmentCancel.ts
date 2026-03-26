"use client";
import { useState } from "react";
import { cancelShipment } from "../services/cancelShipment";

export function useShipmentCancel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const cancel = async (shipmentId: string, reason?: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await cancelShipment(shipmentId, reason);
      setSuccess(true);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to cancel shipment";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { cancel, loading, error, success };
}
