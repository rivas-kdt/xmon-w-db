"use client";
import { useState } from "react";

export function useMetrics() {
  const [barGraphData, setBarGraphData] = useState<any[]>([]);
  const [lineGraphData, setLineGraphData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [shipped, setShipped] = useState(null);
  const [stocked, setStocked] = useState(null);
  const [loading, setLoading] = useState(true);

  setBarGraphData([{ name: "Jan", value: 4000 }]);
  setLineGraphData([{ name: "Jan", value: 2400 }]);
  setTotal(10000);
  setShipped({ thisMonth: 5000, lastMonth: 3000 });
  setStocked({ thisMonth: 2000, lastMonth: 1500 });
  setLoading(false);

  return {
    barGraphData,
    setBarGraphData,
    lineGraphData,
    setLineGraphData,
    total,
    setTotal,
    shipped,
    setShipped,
    stocked,
    setStocked,
  };
}
