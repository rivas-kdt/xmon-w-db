import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { editUser } from "../services/editUser";
import { useUserHooks } from "./useUsersHooks";

export function useEditUserHooks(
  user: any,
  onSuccess?: () => void,
  onOpenChange?: () => void
) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        role: user.role || "",
        location: user.warehouse_id || "",
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditUser = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const payload = {
        userId: user.id,
        username:
          formData.username !== user.username ? formData.username : undefined,
        email: formData.email !== user.email ? formData.email : undefined,
        role: formData.role !== user.role ? formData.role : undefined,
        location:
          formData.location !== user.warehouse_id
            ? formData.location
            : undefined,
      };

      const result = await editUser(payload);
      console.log("Edit user response:", result);

      return result;
    } catch (error) {
      console.error("Exception in handleSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleEditUser,
  };
}
