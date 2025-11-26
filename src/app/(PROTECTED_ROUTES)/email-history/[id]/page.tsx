"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/useMobile";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
      const response = await fetch(`/api/v2/email?id=${id}`);
      const json = await response.json();
      setData(json);
      setLoading(false);
    };
    if (id) getData();
  }, [id]);

  if (loading) return <div>{t("loading-page")}</div>;
  if (!data?.email_transaction?.length) return <div>{t("noTransaction")}.</div>;

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
    <div className=" p-6">
      <div className="text-primary flex justify-between text-2xl font-bold">
        <p>{formatFullDate(data.date)}</p>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {t("email-id")}: {data.email_id}
      </p>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("lotNo")}.</TableHead>
                <TableHead>{t("prodCode")}</TableHead>
                <TableHead>{t("stockNo")}.</TableHead>
                <TableHead>{t("desc")}</TableHead>
                <TableHead>{t("stat")}</TableHead>
                <TableHead>{t("quantity")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.email_transaction.map((t, index) => (
                <TableRow key={index}>
                  <TableCell>{t.lot_no}</TableCell>
                  <TableCell>{t.product_code}</TableCell>
                  <TableCell>{t.stock_no}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>{t.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
