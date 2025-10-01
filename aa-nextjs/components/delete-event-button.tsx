"use client";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { deleteEventAction } from "@/app/[lang]/admin/event/action";
import { useRouter } from "next/navigation";

export default function DeleteEventButton({ eventId }: { eventId: string }) {
  const auth = useAuth();
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState("");

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
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteEventAction(eventId, token);

      if (result?.error) {
        toast.error("Error!", {
          description: result.message || "Failed to delete event",
        });
      } else {
        toast.success("Success!", {
          description: result?.message || "Event deleted successfully",
        });
        router.refresh();
      }
    } catch {
      toast.error("Error!", {
        description: "Failed to delete event",
      });
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
          className="text-destructive hover:text-destructive/80"
        >
          <Trash2Icon className="mr-1 h-3 w-3" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this event?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="my-4 font-bold">
              This action cannot be undone. This will permanently delete this
              event and all its data.
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
                ></Input>
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
            {isDeleting ? "Deleting..." : "Delete Event"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
