"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/useMobile";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil } from "lucide-react";
import { UserTab } from "@/features/admin/components/usersTab";
import { EditUserDialog } from "@/features/admin/components/editUserDialog";
import { WarehouseTab } from "@/features/admin/components/warehouseTab";
import { EditWarehouseDialog } from "@/features/admin/components/editWarehouseDialog";
import { RecipientsTab } from "@/features/admin/components/recipientsTab";
import { useUserHooks } from "@/features/admin/hooks/useUsersHooks";
import { useWarehouseHooks } from "@/features/admin/hooks/useWarehousesHooks";
import { useRecipientHooks } from "@/features/admin/hooks/useRecipientsHooks";

export type Users = {
  id: string;
  username: string;
  email: string;
  role: string;
  location: string | null;
  warehouse: string | null;
  createdAt: string;
} | null;

export type Recipients = {
  id: string;
  email: string;
  isActive: boolean;
  created_at: string;
};

export type Warehouse = {
  id: string;
  warehouse: string;
  location: string;
  workers: number;
  created_at: string | number | Date;
} | null;

const AdminPage = () => {
  const { users, userLoading } = useUserHooks();
  const { warehouseWorker, warehouseLoading } = useWarehouseHooks()
  const { recipients, recipientLoading } = useRecipientHooks()
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editWarehouseOpen, setEditWarehouseOpen] = useState(false);

  const isMobile = useIsMobile();
  const router = useRouter();
  const t = useTranslations("Table");

  // useEffect(() => {
  //   if (isMobile === undefined) return;
  //   if (isMobile) {
  //     router.push("/dashboard");
  //   } else {
  //     setLoading(false);
  //   }
  // }, [isMobile, router]);

  const userColumns: ColumnDef<Users>[] = [
    {
      accessorKey: "username",
      header: t("username"),
    },
    {
      accessorKey: "email",
      header: t("email"),
    },
    {
      accessorKey: "role",
      header: t("role"),
      cell: ({ row }) => {
        const user = row.original;
        return <div>{user?.role === "admin" ? t("admin") : t("worker")}</div>;
      },
    },
    {
      accessorKey: "warehouse",
      header: t("warehouse"),
    },
    {
      id: "actions",
      header: t("actions"),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Button
            onClick={() => {
              setSelectedUser(user);
              setEditUserOpen(true);
            }}
          >
            <Pencil className=" h-5" />
          </Button>
        );
      },
    },
  ];

  const recipientsColumns: ColumnDef<Recipients>[] = [
    {
      accessorKey: "email",
      header: t("email"),
    },
    {
      accessorKey: "isActive",
      header: t("status"),
      cell: ({ row, table }) => {
        const recipient = row.original;
        const onActiveChange = table.options.meta?.onActiveChange;
        return (
          <Switch
            checked={recipient.isActive}
            onCheckedChange={(checked) => {
              if (onActiveChange) onActiveChange(recipient.id, checked);
            }}
            aria-label={`Toggle active status for ${recipient.email}`}
          />
        );
      },
    },
    {
      accessorKey: "created_at",
      header: t("date"),
      cell: ({ row }) => {
        const recipient = row.original;
        const date = new Date(recipient.created_at).toLocaleDateString();
        return <p>{date}</p>;
      },
    },
  ];

  const warehouseColumns: ColumnDef<Warehouse>[] = [
    {
      accessorKey: "warehouse",
      header: t("warehouse"),
    },
    {
      accessorKey: "location",
      header: t("location"),
    },
    {
      accessorKey: "workers",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("workersNo")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "actions",
      header: t("actions"),
      cell: ({ row }) => {
        const warehouse = row.original;
        return (
          <Button
            onClick={() => {
              setSelectedWarehouse(warehouse);
              setEditWarehouseOpen(true);
            }}
          >
            <Pencil className=" h-5" />
          </Button>
        );
      },
    },
  ];

  return (
    <main className="p-4 gap-2">
      <Tabs defaultValue="users" className="space-y-1">
        <TabsList>
          <TabsTrigger value="users">{t("users")}</TabsTrigger>
          <TabsTrigger value="email-recipients">{t("recipients")}</TabsTrigger>
          <TabsTrigger value="warehouses">{t("warehouses")}</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-2">
          <UserTab
            columns={userColumns}
            data={users}
            loading={userLoading}
            // fetchUsersData={fetchUsersData}
          />
        </TabsContent>
        <TabsContent value="email-recipients" className="space-y-2">
          <RecipientsTab
            columns={recipientsColumns}
            data={recipients}
            loading={recipientLoading}
          />
        </TabsContent>
        <TabsContent value="warehouses" className="space-y-2">
          <WarehouseTab
            columns={warehouseColumns}
            data={warehouseWorker}
            loading={warehouseLoading}
            // fetchWarehouseData={fetchWarehouseData}
          />
        </TabsContent>
      </Tabs>

      {/* Shared Dialogs */}
      {/* <EditUserDialog
        open={editUserOpen}
        onOpenChange={setEditUserOpen}
        user={selectedUser}
        locations={[]}
      />
      <EditWarehouseDialog
        open={editWarehouseOpen}
        onOpenChange={setEditWarehouseOpen}
        warehouse={selectedWarehouse}
      /> */}
    </main>
  );
};

export default AdminPage;
