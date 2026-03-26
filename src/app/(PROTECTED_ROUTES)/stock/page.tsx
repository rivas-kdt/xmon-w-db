"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export type Stock = {
  id: string;
  warehouse_id: string;
  part_code: string;
  quantity: number;
  last_updated: string;
};

export default function StockPage() {
  const t = useTranslations("Table");
  const [stockData, setStockData] = useState<Stock[]>([]);
  const [stockLoading, setStockLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"code" | "quantity">("code");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    setStockLoading(true);
    try {
      const response = await fetch("/api/v2/stock");
      if (!response.ok) throw new Error("Failed to fetch stock");
      const data = await response.json();
      setStockData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching stock:", error);
      toast.error(t("error") || "Failed to fetch stock data");
    } finally {
      setStockLoading(false);
    }
  };

  const filteredStock = selectedWarehouse
    ? stockData.filter((s) => s.warehouse_id === selectedWarehouse)
    : stockData;

  // Sort data
  const sortedStock = [...(filteredStock || [])].sort((a, b) => {
    let compareValue = 0;
    if (sortBy === "code") {
      compareValue = a.part_code.localeCompare(b.part_code);
    } else {
      compareValue = a.quantity - b.quantity;
    }
    return sortDirection === "asc" ? compareValue : -compareValue;
  });

  const handleSort = (field: "code" | "quantity") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  if (stockLoading) {
    return (
      <div className="flex justify-center p-8 items-center h-screen">
        <Skeleton className="w-full h-1/2" />
      </div>
    );
  }

  const warehouses = [...new Set(stockData.map((s) => s.warehouse_id))];

  return (
    <main className="p-4 gap-2 bg-gradient-to-b from-primary/10 to-background">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{t("stock") || "Stock"}</h1>
      </div>

      {/* Warehouse Filter */}
      {warehouses.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={selectedWarehouse === null ? "default" : "outline"}
            onClick={() => setSelectedWarehouse(null)}
            size="sm"
          >
            {t("all")} ({stockData.length})
          </Button>
          {warehouses.map((warehouse) => {
            const count = stockData.filter((s) => s.warehouse_id === warehouse).length;
            return (
              <Button
                key={warehouse}
                variant={selectedWarehouse === warehouse ? "default" : "outline"}
                onClick={() => setSelectedWarehouse(warehouse)}
                size="sm"
              >
                {warehouse} ({count})
              </Button>
            );
          })}
        </div>
      )}

      <div className="h-full w-full">
        {sortedStock && sortedStock.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>{t("stockItems") || "Stock Items"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("code")}
                          className="gap-1"
                        >
                          {t("code")}
                          {sortBy === "code" && (
                            <ArrowUpDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>{t("warehouse")}</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("quantity")}
                          className="gap-1"
                        >
                          {t("quantity")}
                          {sortBy === "quantity" && (
                            <ArrowUpDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>{t("date")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedStock.map((stock) => (
                      <TableRow key={`${stock.warehouse_id}-${stock.part_code}`}>
                        <TableCell className="font-medium">{stock.part_code}</TableCell>
                        <TableCell>{stock.warehouse_id}</TableCell>
                        <TableCell>
                          <span className={stock.quantity < 10 ? "text-red-600 font-bold" : ""}>
                            {stock.quantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(stock.last_updated).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">{t("noData")}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
