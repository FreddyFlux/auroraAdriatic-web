"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
// Removed direct import of deleteProperty - now using API route

interface DeletePropertyButtonProps {
  propertyId: string;
}

export default function DeletePropertyButton({
  propertyId,
}: DeletePropertyButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState("");
  const router = useRouter();
  const auth = useAuth();

  const handleDelete = async () => {
    // Check if user typed "delete" correctly
    if (deleteWarning !== "delete") {
      toast.error("Error!", {
        description: "Please type 'delete' to confirm deletion",
      });
      return;
    }

    // verify token
    const token = await auth?.currentUser?.getIdToken();
    if (!token) {
      toast.error("Error!", {
        description: "Authentication required. Please log in again.",
      });
      return;
    }

    setIsDeleting(true);
    try {
      // Call the API route instead of the direct function
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error("Error!", {
          description: result.error || "Failed to delete property",
        });
      } else {
        toast.success("Success!", {
          description: "Property deleted successfully",
        });
        router.refresh();
      }
    } catch (err) {
      toast.error("Error!", {
        description: "Failed to delete property",
      });
      console.error("Error deleting property:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this property?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="my-4 font-bold">
              This action cannot be undone. This will permanently delete this
              property and all its data.
              <div>
                <Label className="mt-4 mb-2">
                  Enter &quot;delete&quot; to confirm
                </Label>
                <Input
                  value={deleteWarning}
                  onChange={(e) => setDeleteWarning(e.target.value)}
                  type="text"
                  className={
                    deleteWarning === "delete" ? "border-green-500" : ""
                  }
                  placeholder="Type 'delete' to confirm"
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || deleteWarning !== "delete"}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Property"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
