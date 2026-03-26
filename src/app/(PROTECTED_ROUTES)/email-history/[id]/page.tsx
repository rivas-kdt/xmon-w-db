"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/useMobile";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type TransactionHistory = {
  lot_no: string;
  stock_no: string;
  description: string;
  product_code: string;
  status: string;
  quantity: number;
};

type EmailTransaction = {
  email_id: string;
  date: string;
  email_transaction: TransactionHistory[];
};

export default function EmailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<EmailTransaction>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isMobile = useIsMobile();

  const t = useTranslations("email-history");

  useEffect(() => {
    if (isMobile === undefined) return;
    if (isMobile) {
      router.push("/dashboard");
    } else {
      setLoading(false);
    }
  }, [isMobile, router]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/v2/email?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch email data");
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching email:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) getData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center p-8 items-center h-screen w-screen">
        <Skeleton className="w-full h-1/2" />
      </div>
    );
  }

  if (!data?.email_transaction?.length) {
    return (
      <div className="p-6">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("back") || "Back"}
        </Button>
        <div className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">{t("noTransaction")}.</p>
        </div>
      </div>
    );
  }

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    const fullDate = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${fullDate}`;
  };

  return (
    <div className="p-6">
      <Button
        onClick={() => router.back()}
        variant="outline"
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t("back") || "Back"}
      </Button>

      <div className="text-primary flex justify-between text-2xl font-bold mb-4">
        <p>{formatFullDate(data.date)}</p>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        {t("email-id")}: {data.email_id}
      </p>

      <Card>
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold">
            {t("transactions") || "Transactions"} ({data.email_transaction.length})
          </h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("lotNo")}.</TableHead>
                  <TableHead>{t("prodCode")}</TableHead>
                  <TableHead>{t("stockNo")}.</TableHead>
                  <TableHead>{t("desc")}</TableHead>
                  <TableHead>{t("stat")}</TableHead>
                  <TableHead className="text-right">{t("quantity")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.email_transaction.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{transaction.lot_no}</TableCell>
                    <TableCell>{transaction.product_code}</TableCell>
                    <TableCell>{transaction.stock_no}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        transaction.status === "出荷" ? "bg-amber-100 text-amber-800" :
                        transaction.status === "入荷" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{transaction.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
