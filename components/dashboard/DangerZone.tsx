"use client";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-context";
import { BASE_URL, handleContactSupport } from "@/lib/utils";
import { SectionWrapper } from "../SectionWrapper";
import { useState } from "react";
import ActionNotAllowedModal from "../ui/ActionNotAllowed";

interface DangerZoneProps {
  userId: string;
  isAdmin?: boolean;
}

export default function DangerZone({
  userId,
  isAdmin = false,
}: DangerZoneProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    if (!isAdmin) {
      setIsModalOpen(true);
      return;
    }
    // const confirmationMessage = isAdmin
    //   ? "Are you sure you want to delete this user account?"
    //   : "Are you sure you want to delete your account? This action cannot be undone.";

    // if (!confirm(confirmationMessage)) return;

    // try {
    //   const response = await fetch(
    //     `${BASE_URL}/api/v1/users/delete${isAdmin ? `?user_id=${userId}` : ""}`,
    //     {
    //       method: "DELETE",
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    //       },
    //     }
    //   );

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.detail || "Deletion failed");
    //   }

    //   showToast(
    //     isAdmin
    //       ? "User account deleted successfully"
    //       : "Your account has been deleted",
    //     "success"
    //   );

    //   if (!isAdmin) {
    //     // Redirect after self-deletion
    //     localStorage.removeItem("access_token");
    //     localStorage.removeItem("user");
    //     router.push("/auth/signin");
    //   } else {
    //     // Refresh admin view
    //     router.refresh();
    //   }
    // } catch (error: any) {
    //   showToast(error.message, "error");
    // }
  };

  return (
    <SectionWrapper
      icon={<ShieldAlert className="w-5 h-5" />}
      title={isAdmin ? "Admin Actions" : "Danger Zone"}
    >
      <div className="p-4 border border-red-200 rounded-lg">
        <p className="font-medium">
          {isAdmin ? "Delete User Account" : "Delete Account"}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          {isAdmin
            ? "This will permanently disable the user account"
            : "Once deleted, your account cannot be recovered"}
        </p>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {isAdmin ? "Delete User" : "Delete My Account"}
        </button>
      </div>

      <ActionNotAllowedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Permission Denied"
        message="You don't have sufficient privileges to delete user accounts. This action requires administrator permissions."
        actionLabel="Contact Admin"
        onAction={handleContactSupport}
      />
    </SectionWrapper>
  );
}
