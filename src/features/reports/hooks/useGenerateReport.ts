"use client";
import { useState } from "react";
import { generateInventoryReport } from "../services/generateInventoryReport";
import { generateSalesReport } from "../services/generateSalesReport";
import { generateWarehouseReport } from "../services/generateWarehouseReport";

interface DateRange {
  startDate?: string;
  endDate?: string;
}

export function useGenerateReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  const generateInventory = async (params?: DateRange) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateInventoryReport(params);
      setReportData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to generate report";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateSales = async (params?: DateRange) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateSalesReport(params);
      setReportData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to generate report";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateWarehouse = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateWarehouseReport();
      setReportData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to generate report";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { reportData, loading, error, generateInventory, generateSales, generateWarehouse };
}
