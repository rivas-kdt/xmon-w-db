"use client";

import { Button } from "@/components/ui/button";
import { InventoryTable } from "@/features/inventory/components/page";
import { useInventoryHooks } from "@/features/inventory/hooks/useInventoryHooks";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useEffect } from "react";

export type Inventory = {
  lot_no: string;
  product_code: string;
  stock_no: string;
  description: string;
  warehouse: string;
  created_at: string;
  quantity: number;
} | null;

const InventoryPage = () => {
  const t = useTranslations("Table");

  const { inventory, inventoryLoading } = useInventoryHooks();

  const InventoryColumns: ColumnDef<Inventory>[] = [
    {
      accessorKey: "lot_no",
      header: t("lotNo"),
    },
    {
      accessorKey: "product_code",
      header: t("prodCode"),
    },
    {
      accessorKey: "stock_no",
      header: t("stockNo"),
    },
    {
      accessorKey: "description",
      header: t("description"),
    },
    {
      accessorKey: "warehouse",
      header: t("warehouse"),
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("quantity")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: t("date"),
      cell: ({ row }) => {
        const parts = row.original;
        const date2 =
          parts && parts.created_at
            ? new Date(parts.created_at).toLocaleDateString()
            : "-";
        return <p>{date2}</p>;
      },
    },
  ];

  return (
    <main className="  p-4 gap-2 bg-gradient-to-b from-primary/10 to-background">
      <div className="  h-full w-full flex items-center">
        <InventoryTable
          columns={InventoryColumns}
          data={inventory}
          loading={inventoryLoading}
        />
      </div>
    </main>
  );
};

export default InventoryPage;
