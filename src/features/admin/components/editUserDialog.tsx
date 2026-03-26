"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { EditUserDialogProps } from "@/types/users";
import { useEditUserHooks } from "../hooks/editUserHooks";
import { deleteUser } from "../services/deleteUser";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export function EditUserDialog({
  user,
  locations,
  open,
  onOpenChange,
  onSuccess,
}: EditUserDialogProps) {
  const { formData, handleChange, handleEditUser, isLoading } =
    useEditUserHooks(user);
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("editUser");

  const handleSubmit = async () => {
    const res = await handleEditUser();
    if (res?.success) {
      toast.success("User updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } else {
      toast.error(res?.error || "Failed to update user");
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    if (!confirm("Are you sure you want to delete this user?")) return;

    setIsDeleting(true);
    try {
      await deleteUser(user.id);
      toast.success("User deleted successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("header")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              {t("username")}
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              {t("email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              {t("role")}
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">{t("admin")}</SelectItem>
                <SelectItem value="worker">{t("worker")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              {t("location")}
            </Label>

            <Select
              value={formData.location ?? ""}
              onValueChange={(value) => handleChange("location", value)}
            >
              <SelectTrigger className="col-span-3" id="location">
                <SelectValue placeholder={t("selectLoc")} />
              </SelectTrigger>

              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.warehouse}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex gap-2 justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || isLoading}
            size="sm"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("deleting")}
              </>
            ) : (
              <>
                <Trash2 className="mr-1 h-4 w-4" />
                {t("delete")}
              </>
            )}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || isDeleting}
            size="sm"
            className="bg-[#EAB308] text-[#f1f1f1] hover:bg-[#CA8A04]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("updating")}
              </>
            ) : (
              t("update")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
