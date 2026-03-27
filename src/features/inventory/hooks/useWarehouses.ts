"use client";

import { useEffect, useState } from "react";
import { getWarehouses } from "../services/getWarehouses";

export function useWarehouses() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoading(true);
      try {
        const data = await getWarehouses();
        setWarehouses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  return { warehouses, loading };
}
