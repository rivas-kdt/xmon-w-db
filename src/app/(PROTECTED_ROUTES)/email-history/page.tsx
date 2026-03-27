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
import { useEmailHistory } from "@/features/email-history/hooks/useEmailHistory";
import { Loader2, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text: unknown, query: string) {
  const safeText = String(text ?? "");
  const safeQuery = query.trim();

  if (!safeQuery) return safeText;

  const regex = new RegExp(`(${escapeRegExp(safeQuery)})`, "ig");
  const parts = safeText.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={`${part}-${index}`}
        className="bg-yellow-200 text-black px-0.5 rounded"
      >
        {part}
      </mark>
    ) : (
      <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
    )
  );
}

export default function EmailHistory() {
  // const router = useRouter();
  // const isMobile = useIsMobile();

  const [sendingEmail, setSendingEmail] = useState(false);

  const t = useTranslations("email-history");

  // useEffect(() => {
  //   if (isMobile === undefined) return;
  //   if (isMobile) {
  //     router.push("/dashboard");
  //   } else {
  //     setLoading(false);
  //   }
  // }, [isMobile, router]);
  const {
    history,
    loading,
    error,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
  } = useEmailHistory(1, 10, "");

  const handleResendEmail = async () => {
    setSendingEmail(true);
    try {
      const res = await fetch("/api/resend/email", {
        method: "POST",
      });

      if (res.status === 204) {
        toast.error(t("noDataToSend"));
      } else if (!res.ok) {
        const errorData = await res.json();
        toast.error(
          t("failedSend", { error: errorData?.error || t("unknownError") })
        );
      } else {
        toast.success(t("emailSent"));
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(t("unexpectedError"));
    } finally {
      setSendingEmail(false);
      // fetchHistory();
    }
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    const fullDate = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${fullDate}`;
  };

  if (loading && !history.length) {
    return (
      <div className="flex justify-center p-8 items-center h-screen w-screen">
        <Skeleton className="w-full h-1/2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">
          {t("error")}: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button
          onClick={handleResendEmail}
          disabled={sendingEmail}
          className="py-2 px-4 flex items-center gap-2 shadow-md bg-primary"
        >
          {sendingEmail ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t("sending")}</span>
            </>
          ) : (
            <>
              <Mail className="h-6 w-6" />
              <span>{t("sendEmail")}</span>
            </>
          )}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={t("search") || "Search by email ID or date..."}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {history.length === 0 ? (
        <div className="flex justify-center items-center p-8">
          <p className="text-muted-foreground">{t("noHistory")}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            {history.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-primary flex justify-between">
                    <p>{formatFullDate(item.date)}</p>
                    <Link
                      href={`/email-history/${item.email_id}`}
                      className="bg-primary text-primary-foreground text-base px-2 py-1 rounded-md font-normal hover:bg-primary/90"
                    >
                      {t("full-list")}
                    </Link>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t("email-id")}: {item.email_id}
                  </p>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
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
                      {item.email_transaction
                        .slice(0, 5)
                        .map((tx: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell>
                              {highlightText(tx.lot_no, search)}
                            </TableCell>
                            <TableCell>
                              {highlightText(tx.product_code, search)}
                            </TableCell>
                            <TableCell>
                              {highlightText(tx.stock_no, search)}
                            </TableCell>
                            <TableCell>
                              {highlightText(tx.description, search)}
                            </TableCell>
                            <TableCell>
                              {highlightText(tx.status, search)}
                            </TableCell>
                            <TableCell>
                              {highlightText(tx.quantity, search)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  {item.email_transaction.length > 5 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      +{item.email_transaction.length - 5} {t("moreItems")}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
