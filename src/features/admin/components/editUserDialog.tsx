"use client";

import { useEffect, useState } from "react";
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

export function EditUserDialog({
  user,
  locations,
  open,
  onOpenChange,
  onSuccess,
}: EditUserDialogProps) {
  const { formData, handleChange, handleEditUser, isLoading } =
    useEditUserHooks(user);

  const t = useTranslations("editUser");

  const handleSubmit = async () => {
    const res = await handleEditUser();
    if (res?.success) {
      onOpenChange(false);
      onSuccess?.();
    } else {
      console.error("Error updating user:", res?.error);
    }
  };
  console.log("EditUserDialog warehouse:", locations);
  console.log("EditUserDialog user:", user);
  console.log("EditUserDialog formData:", formData);
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
            <Label htmlFor="role" className="text-right">
              Location
            </Label>

            <Select
              value={formData.location ?? ""} // ✅ location is warehouse_id
              onValueChange={(value) => handleChange("location", value)}
            >
              <SelectTrigger className="col-span-3" id="location">
                <SelectValue placeholder="Select Location" />
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
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-amber-400 hover:bg-amber-400/75 text-black"
          >
            {isLoading ? t("addingState") : t("button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
