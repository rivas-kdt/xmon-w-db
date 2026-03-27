"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryTable } from "@/features/inventory/components/page";
import { useInventoryHooks } from "@/features/inventory/hooks/useInventoryHooks";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { EditInventoryDialog } from "@/features/inventory/components/editInventoryDialog";

// export type Inventory = {
//   lot_no: string;
//   product_code: string;
//   stock_no: string;
//   description: string;
//   warehouse: string;
//   created_at: string;
//   quantity: number;
// } | null;

const InventoryPage = () => {
  const t = useTranslations("Table");

  const { inventory, inventoryLoading, refetchinventory } = useInventoryHooks();
  const [selectedItem, setSelectedItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = (item: Inventory) => {
    if (!item) return;

    setSelectedItem({ ...item });
    setEditOpen(true);
  };

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
    {
      id: "actions",
      header: t("actions") || "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEdit(row.original)}
          className="gap-2"
        >
          <Edit2 className="h-4 w-4" />
          {t("edit")}
        </Button>
      ),
    },
  ];

  return (
    <main className="p-4 gap-2 bg-gradient-to-b from-primary/10 to-background">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{t("partsInventory")}</h1>
      </div>

      <div className="h-full w-full flex items-center">
        <Card className="w-full">
          <CardHeader>
            {/* <CardTitle>{t("inventoryItems") || "Inventory Items"}</CardTitle> */}
          </CardHeader>
          <CardContent>
            <InventoryTable
              columns={InventoryColumns}
              data={inventory}
              loading={inventoryLoading}
            />
          </CardContent>
        </Card>
      </div>

      {selectedItem && (
        <EditInventoryDialog
          item={selectedItem as any}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSuccess={() => {
            refetchinventory();
            setSelectedItem(null);
          }}
        />
      )}
    </main>
  );
};

export default InventoryPage;
