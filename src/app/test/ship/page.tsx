"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Camera,
  ArrowDownToLine,
  Loader2,
  Minus,
} from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/useMobile";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useShipHooks } from "@/features/ship/hooks/shipHooks";
import { useShippingActions } from "@/features/ship/hooks/shippingActions";
import QrScanner from "@/features/ship/components/qr-scanner";
import toast from "react-hot-toast";

interface WarehouseItem {
  id: string;
  product_code: string;
  stock_no: string;
  lot_no: string;
  description: string;
  quantity: number;
  selected: boolean;
  ship_quantity: number | string;
}

export default function ShippedView() {
  const router = useRouter();

  const [scanning, setScanning] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const t = useTranslations("stock/ship");

  // If user is using desktop, redirect him to /dashboard
  useEffect(() => {
    if (isMobile === undefined) return; // wait for detection

    if (!isMobile) {
      router.push("/dashboard");
    }
  }, [isMobile, router]);

  const {
    loading,
    fetchStockedParts,
    fetching,
    stockedParts,
    toggleItemSelection,
    // toggleItemAdded,
    message,
    error,
    shipParts,
    handleScan,
    moveSelectedItems,
    removeFromShipping,
    handleInputChange,
    selectedItems,
  } = useShipHooks({
    t,
    setScanning,
    setHighlightedItem,
  });

  useEffect(() => {
    // const warehouseData = sessionStorage.getItem("selectedWarehouse");
    // if (warehouseData) {
    //   try {
    //     const parsedWarehouse = JSON.parse(warehouseData);
    //     setSelectedWarehouse(parsedWarehouse);
    //   } catch (e) {
    //     console.error("Error parsing warehouse data:", e);
    //   }
    // }
    fetchStockedParts();
  }, [router]);

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col w-screen p-4 pt-20  bg-gradient-to-b from-primary/10 to-background">
        {/* Back Button */}
        <Link href="/test">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6 -ml-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-medium ml-2 mb-2">{t("ship-items")}</h1>

        {/* QR Scanner */}
        {scanning ? (
          <Card className="mb-4">
            <CardContent className="p-4">
              <QrScanner
                onScan={(data: string) => handleScan(data)}
                onClose={() => setScanning(false)}
              />
            </CardContent>
          </Card>
        ) : (
          <Button
            className="mb-4 bg-primary text-md py-6"
            onClick={() => setScanning(true)}
          >
            <Camera style={{ width: "20px", height: "20px" }} />
            {t("b1")}
          </Button>
        )}

        {/* Table 1: Stocked Items */}
        <Card className="mb-4">
          <CardHeader className="py-2">
            <CardTitle className="text-lg">{t("ship-title1")}</CardTitle>
          </CardHeader>
          <CardContent className="p-2 overflow-auto max-h-[30vh]">
            {fetching ? (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <p>{t("loading-items")}</p>
              </div>
            ) : stockedParts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>{t("no-items-warehouse")}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="whitespace-nowrap">
                    <TableHead className="w-[50px]">{t("select")}</TableHead>
                    <TableHead>{t("th1")}</TableHead>
                    <TableHead>{t("th2")}</TableHead>
                    <TableHead>{t("th3")}</TableHead>
                    <TableHead>{t("th4")}</TableHead>
                    <TableHead>{t("th5")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="whitespace-nowrap">
                  {stockedParts
                    .filter((item) => item.quantity > 0 && !item.added)
                    .map((item) => (
                      <TableRow
                        key={item.lot_no}
                        className={
                          highlightedItem === item.lot_no ? "bg-primary/10" : ""
                        }
                      >
                        <TableCell>
                          <Checkbox
                            checked={item.selected}
                            onCheckedChange={() => toggleItemSelection(item)}
                          />
                        </TableCell>
                        <TableCell>{item.lot_no}</TableCell>
                        <TableCell>{item.product_code}</TableCell>
                        <TableCell>{item.stock_no}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <div className="p-2">
            <Button
              onClick={() => {
                moveSelectedItems(stockedParts, setHighlightedItem);
                // toggleItemAdded(stockedParts);
                stockedParts
                  .filter((item) => item.selected)
                  .forEach((item) => {
                    // Use setTimeout to ensure toast renders after state updates
                    setTimeout(() => {
                      toast.success(`${t("itemAdded")}: ${item.lot_no}`);
                    }, 0);
                  });
              }}
              disabled={!stockedParts.some((item) => item.selected)}
              className="w-full bg-primary text-md h-[50px]"
            >
              <ArrowDownToLine style={{ width: "20px", height: "20px" }} />
              {t("b3")}
            </Button>
          </div>
        </Card>

        {/* Table 2: Items to Ship */}
        <Card className="mb-4">
          <CardHeader className="py-2">
            <CardTitle className="text-lg">{t("ship-title2")}</CardTitle>
          </CardHeader>
          <CardContent className="p-2 overflow-y-auto max-h-[18vh]">
            {selectedItems.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>{t("no-added-items")}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="whitespace-nowrap">
                    <TableHead>{t("th1")}</TableHead>
                    <TableHead>{t("th2")}</TableHead>
                    <TableHead>{t("th3")}</TableHead>
                    <TableHead>{t("th4")}</TableHead>
                    <TableHead>{t("stock")}</TableHead>
                    <TableHead>{t("th5")}</TableHead>
                    <TableHead className="w-[80px]">{t("remove")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="whitespace-nowrap">
                  {selectedItems.map((item, index) => (
                    <TableRow key={item.lot_no}>
                      <TableCell>{item.lot_no}</TableCell>
                      <TableCell>{item.product_code}</TableCell>
                      <TableCell>{item.stock_no}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          max={item.quantity}
                          className="w-20 p-1 border rounded-md"
                          value={
                            item.ship_quantity === ""
                              ? ""
                              : String(item.ship_quantity)
                          }
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            removeFromShipping(item);
                            toast.success(
                              t("removeItem", { lotNo: item.lot_no })
                            );
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                          <span className="sr-only">{t("remove")}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Ship Button */}
        <Button
          className="w-full py-6 mt-auto bg-primary mb-4 text-md h-[50px]"
          disabled={loading || selectedItems.length === 0}
          onClick={() => shipParts(selectedItems)}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t("processing")}
            </>
          ) : (
            <>
              {t("ship")} ({selectedItems.length})
            </>
          )}
        </Button>
      </div>
    </ScrollArea>
  );
}
