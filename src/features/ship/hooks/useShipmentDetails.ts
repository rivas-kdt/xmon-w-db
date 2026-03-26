"use client";
import { useState } from "react";
import { getShipmentDetails } from "../services/getShipmentDetails";

interface ShipmentDetail {
  id: number;
  lot_no: string;
  stock_no: string;
  description: string;
  quantity: number;
  status: string;
  warehouse?: string;
  recipient_name?: string;
  recipient_email?: string;
  created_at: string;
}

export function useShipmentDetails(shipmentId?: string) {
  const [details, setDetails] = useState<ShipmentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    if (!shipmentId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getShipmentDetails(shipmentId);
      setDetails(result);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch shipment details";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { details, loading, error, fetchDetails };
}
