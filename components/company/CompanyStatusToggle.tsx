import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { useToast } from "../ui/toast-context";
import { BASE_URL } from "@/lib/utils";

interface CompanyStatusToggleProps {
  companyId: string;
  initialStatus: "active" | "inactive" | "pending";
  isAuthorized?: boolean; // Whether current user is creator or admin
  onStatusChange?: (newStatus: "active" | "inactive") => void;
}

const CompanyStatusToggle: React.FC<CompanyStatusToggleProps> = ({
  companyId,
  initialStatus,
  isAuthorized,
  onStatusChange,
}) => {
  const [status, setStatus] = useState<"active" | "inactive" | "pending">(
    initialStatus
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const handleStatusChange = async (checked: boolean) => {
    // if (!isAuthorized) {
    //   showToast(
    //     "Permission Denied: Only the company creator or administrators can change company status.",
    //     "error"
    //   );
    //   return;
    // }

    const newStatus = checked ? "active" : "inactive";

    try {
      setIsLoading(true);

      const response = await axios.patch(
        `${BASE_URL}/api/v1/company/${companyId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        setStatus(newStatus);

        showToast(
          `Status Updated: Company status changed to ${newStatus}.`,
          "success"
        );

        // Notify parent component if callback provided
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
      }
      if (
        response.status !== 200 &&
        response.data.detail ===
          "Not authorized to update this company's status"
      ) {
        showToast(
          "Permission Denied: Only the company creator or administrators can change company status.",
          "error"
        );
      }
    } catch (error) {
      console.error("Failed to update company status:", error);

      showToast(
        "Update Failed: There was an error updating the company status. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between pb-4">
      <div>
        <p className="font-medium">Company Status</p>
        <p className="text-sm text-gray-500">
          {status === "active"
            ? "Your company is visible to users"
            : "Your company is currently hidden"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">
          {isLoading
            ? "Updating..."
            : status === "active"
            ? "Active"
            : "Inactive"}
        </span>
        <Switch
          checked={status === "active"}
          onCheckedChange={handleStatusChange}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default CompanyStatusToggle;
