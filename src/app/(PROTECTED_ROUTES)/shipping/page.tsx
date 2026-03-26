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
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Shipment {
  id: string;
  shipment_number: string;
  status: string;
  destination: string;
  created_at: string;
  updated_at: string;
}

export default function ShippingPage() {
  const t = useTranslations("Table");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v2/ship/shipments");
      if (!response.ok) throw new Error("Failed to fetch shipments");
      const data = await response.json();
      setShipments(data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      toast.error(t("error") || "Failed to fetch shipments");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredShipments = statusFilter
    ? shipments.filter((s) => s.status.toLowerCase() === statusFilter.toLowerCase())
    : shipments;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8 items-center h-screen">
        <Skeleton className="w-full h-1/2" />
      </div>
    );
  }

  return (
    <main className="p-4 gap-2 bg-gradient-to-b from-primary/10 to-background">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{t("shipping") || "Shipping"}</h1>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          variant={statusFilter === null ? "default" : "outline"}
          onClick={() => setStatusFilter(null)}
          size="sm"
        >
          {t("all")} ({shipments.length})
        </Button>
        {["pending", "in_transit", "delivered", "cancelled"].map((status) => {
          const count = shipments.filter(
            (s) => s.status.toLowerCase() === status.toLowerCase()
          ).length;
          return (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              size="sm"
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")} ({count})
            </Button>
          );
        })}
      </div>

      <div className="h-full w-full">
        {filteredShipments.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>{t("shipments") || "Shipments"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("id") || "ID"}</TableHead>
                      <TableHead>{t("number") || "Shipment #"}</TableHead>
                      <TableHead>{t("destination") || "Destination"}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead>{t("createdDate") || "Created"}</TableHead>
                      <TableHead>{t("updatedDate") || "Updated"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.id}</TableCell>
                        <TableCell>{shipment.shipment_number}</TableCell>
                        <TableCell>{shipment.destination}</TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                            {shipment.status}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(shipment.created_at)}</TableCell>
                        <TableCell>{formatDate(shipment.updated_at)}</TableCell>
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
