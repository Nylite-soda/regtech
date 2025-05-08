"use client";
import { ShieldAlert, AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-context";
import { BASE_URL, handleContactSupport } from "@/lib/utils";
import { SectionWrapper } from "../SectionWrapper";
import { useState } from "react";
import ActionNotAllowedModal from "../ui/ActionNotAllowed";
import { Company, UserData } from "@/types";

interface DangerZoneProps {
  user?: UserData;
  company?: Company;
  isAdmin?: boolean;
}

export default function DangerZone({
  user,
  company,
  isAdmin = false,
}: DangerZoneProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");

  // Determine what type of entity we're dealing with
  const isCompany = !!company;
  const entityType = isCompany ? "company" : "user";
  const entityId = isCompany ? company?.id : user?.id;
  const entityName = isCompany
    ? company?.name
    : user?.email || user?.first_name;

  // Text to type for confirmation
  const confirmationText = isAdmin
    ? "DELETE"
    : isCompany
    ? "DELETE COMPANY"
    : "DELETE ACCOUNT";

  const handleInitiateDelete = () => {
    // For admins or company owners, check if they have permission
    if (!isCompany && isAdmin && !user?.is_superadmin) {
      setIsModalOpen(true);
      return;
    }

    // If they have permission, show the confirm modal
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (!isAdmin && confirmValue !== confirmationText) {
      showToast("Please type DELETE ACCOUNT to confirm", "error");
      return;
    }

    if (isAdmin && confirmValue !== confirmationText) {
      showToast("Please type DELETE to confirm", "error");
      return;
    }

    setIsProcessing(true);

    try {
      // Different endpoints based on entity type
      let endpoint = "";

      if (isCompany) {
        // Company deletion endpoint - uses path parameter
        endpoint = `${BASE_URL}/api/v1/companies/${entityId}`;
      } else {
        if (isAdmin) {
          // Admin deleting a user - uses path parameter
          endpoint = `${BASE_URL}/api/v1/users/${entityId}`;
        } else {
          // Self-deletion for user - uses currently logged in user
          endpoint = `${BASE_URL}/api/v1/users/self`;
        }
      }

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Deletion failed");
      }

      showToast(
        isAdmin
          ? `${isCompany ? "Company" : "User"} account deleted successfully`
          : isCompany
          ? "Company has been deleted"
          : "Your account has been deleted",
        "success"
      );

      // Close the modal
      setIsConfirmModalOpen(false);

      if (!isAdmin) {
        // Redirect after self-deletion
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        router.push("/auth/signin");
      } else {
        // Refresh admin view
        router.refresh();
      }
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <SectionWrapper
        icon={<ShieldAlert className="w-5 h-5" />}
        title={isAdmin ? "Admin Actions" : "Danger Zone"}
      >
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="font-medium">
            {isAdmin
              ? `Delete ${isCompany ? "Company" : "User"} Account`
              : "Delete Account"}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            {isAdmin
              ? `This will permanently delete the ${
                  isCompany ? "company" : "user"
                } account and all associated data`
              : "Once deleted, your account cannot be recovered and all your data will be permanently removed"}
          </p>
          <button
            onClick={handleInitiateDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            {isAdmin
              ? `Delete ${isCompany ? "Company" : "User"}`
              : "Delete My Account"}
          </button>
        </div>

        {/* Permission denied modal */}
        <ActionNotAllowedModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Permission Denied"
          message={
            isCompany
              ? "You don't have permission to delete this company. Only the creator can delete a company."
              : "You don't have sufficient privileges to delete user accounts. This action requires super administrator permissions."
          }
          actionLabel="Contact Admin"
          onAction={handleContactSupport}
        />

        {/* Confirmation modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-red-600 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Confirm Deletion
                </h3>
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <div className="p-3 bg-red-100 rounded-md text-red-800 mb-4">
                  <p className="font-medium">
                    Warning: This action cannot be undone!
                  </p>
                  <p className="text-sm mt-1">
                    {isAdmin
                      ? `You are about to permanently delete ${entityType} ${
                          entityName || entityId
                        }.`
                      : "You are about to permanently delete your account."}
                  </p>
                </div>

                <p className="text-gray-700 mb-4">
                  To confirm, please type <strong>{confirmationText}</strong>{" "}
                  below:
                </p>

                <input
                  type="text"
                  value={confirmValue}
                  onChange={(e) => setConfirmValue(e.target.value)}
                  placeholder={confirmationText}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                  disabled={isProcessing || confirmValue !== confirmationText}
                >
                  {isProcessing ? "Processing..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </SectionWrapper>
    </>
  );
}
