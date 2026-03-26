"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  viewLabel?: string;
  isLoading?: boolean;
  isDeleting?: boolean;
  size?: "sm" | "lg" | "default" | "icon";
}

export function ActionButtons({
  onEdit,
  onDelete,
  onView,
  editLabel = "Edit",
  deleteLabel = "Delete",
  viewLabel = "View",
  isLoading = false,
  isDeleting = false,
  size = "sm",
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {onView && (
        <Button
          onClick={onView}
          size={size}
          variant="ghost"
          className="gap-1.5 hover:bg-blue-50 dark:hover:bg-blue-950"
          disabled={isLoading || isDeleting}
        >
          <Eye className="h-4 w-4" />
          {viewLabel}
        </Button>
      )}
      {onEdit && (
        <Button
          onClick={onEdit}
          size={size}
          variant="outline"
          className="gap-1.5 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300"
          disabled={isLoading || isDeleting}
        >
          <Edit className="h-4 w-4" />
          {editLabel}
        </Button>
      )}
      {onDelete && (
        <Button
          onClick={onDelete}
          size={size}
          variant="destructive"
          className="gap-1.5"
          disabled={isLoading || isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          {deleteLabel}
        </Button>
      )}
    </div>
  );
}
