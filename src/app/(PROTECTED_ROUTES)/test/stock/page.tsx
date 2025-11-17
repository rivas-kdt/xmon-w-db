"use client";

import QrScanner from "@/components/qr-scanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStockHooks } from "@/features/landing/hooks/useStockHooks";
import { useIsMobile } from "@/hooks/useMobile";
import { ArrowLeft, Camera, Trash, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface ScannedItem {
  id: string;
  productCode: string;
  stockNo: string;
  lotNo: string;
  description: string;
  quantity: number;
}

export default function StockView() {
  const router = useRouter();

  const [scanning, setScanning] = useState(false);
  const isMobile = useIsMobile();
  const t = useTranslations("stock/ship");
  const { theme } = useTheme();
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [receipt, setReceipt] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //   const {
  //     stockedLoading,
  //     // handleScan,
  //   } = useStockHooks({
  //     // t,
  //     // setScanning,
  //   });

  const handleScan = (data: string) => {
    if (data) {
      setScanning(false);
      try {
        const values = data.split(",");
        if (values.length < 6) {
          toast.error("QR code format is incorrect.", {
            duration: 4000,
          });
          return;
        }

        const productCode = values[1];
        const stockNo = values[3];
        const description = values[4];
        const lotNo = values[5];
        const quantity = Number(values[6]);

        const newItem: ScannedItem = {
          id: Date.now().toString(),
          productCode,
          stockNo,
          lotNo,
          description,
          quantity,
        };

        setScannedItems((prev) => [...prev, newItem]);

        // Show success toast after adding the item
        toast.success(`Added item: ${lotNo}`, {
          duration: 4000,
        });
      } catch (error) {
        console.error("Error processing QR code:", error);
      }
    }
  };

  const handleQuantityChange = (id: string, newQuantity: string) => {
    // Convert the string to a number and ensure it's a valid number
    const quantity = parseInt(newQuantity, 10);

    // Ensure that if the value is NaN, it defaults to 0
    setScannedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: isNaN(quantity) ? 0 : quantity }
          : item
      )
    );
  };

  const handleUploadReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const receiptBase64 = event.target?.result as string;
        setReceipt(receiptBase64);
        sessionStorage.setItem("receiptImage", receiptBase64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col w-screen p-4 pt-20  bg-gradient-to-b from-primary/10 to-background">
      {/* Back Button */}
      <Link href="/test">
        <Button
          variant="ghost"
          size="icon"
          className="active:bg-primary transition"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </Link>
      <h1 className="text-xl font-bold ml-2 mb-2">{t("stock-items")}</h1>

      {/* QR Scanner Handling */}
      {scanning ? (
        <Card className="mb-4">
          <CardContent className="p-.5">
            <QrScanner onScan={handleScan} onClose={() => setScanning(false)} />
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setScanning(true)}
          className="bg-primary text-md w-full h-[50px] mb-4"
        >
          <Camera style={{ width: "20px", height: "20px" }} />
          {t("scanqr")}
        </Button>
      )}

      {/* Scanned Items Table */}
      <div className="relative max-h-[500px] overflow-auto">
        <Table className="w-full m-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>{t("lotNo")}</TableHead>
              <TableHead>{t("prodNo")}</TableHead>
              <TableHead>{t("stockNo")}</TableHead>
              <TableHead>{t("desc")}</TableHead>
              <TableHead>{t("quantity")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scannedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.productCode}</TableCell>
                <TableCell>{item.stockNo}</TableCell>
                <TableCell>{item.lotNo}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={isNaN(item.quantity) ? 0 : item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, e.target.value)
                    }
                    className="w-20 p-1 border rounded-md"
                    placeholder="0"
                    min="1"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* File Upload */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleUploadReceipt}
      />

      {!receipt && (
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary mb-4 mt-4 text-md h-[50px] w-full"
        >
          <Upload className="h-5 w-5 mr-2" />
          {t("upload")}
        </Button>
      )}
      {receipt && (
        <Card className="my-4 relative">
          <CardContent className="p-4 flex items-start justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src={receipt}
                  alt="Receipt"
                  className="max-h-48 object-contain cursor-zoom-in mx-auto"
                />
              </DialogTrigger>

              <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 flex items-center justify-center">
                <VisuallyHidden>
                  <DialogTitle>View</DialogTitle>
                </VisuallyHidden>

                <TransformWrapper
                  initialScale={1}
                  minScale={1}
                  maxScale={4}
                  doubleClick={{ mode: "zoomIn" }}
                  wheel={{ step: 0.2 }}
                >
                  <TransformComponent>
                    <img
                      src={receipt}
                      alt="Receipt Large"
                      className="max-w-full max-h-full object-contain"
                    />
                  </TransformComponent>
                </TransformWrapper>
              </DialogContent>
            </Dialog>

            <Button
              variant="destructive"
              size="icon"
              onClick={() => setReceipt(null)}
              className="absolute top-4 right-4"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stock Items Button */}
      <Button
        // onClick={handleStockItems}
        // disabled={stockedLoading || scannedItems.length === 0 || !receipt}
        className="w-full h-[50px] py-6 mt-auto bg-primary mb-4 text-md"
      >
        {/* {stockedLoading ? t("processing") : t("stock")} */}
        {t("stock")}
      </Button>
    </div>
  );
}
