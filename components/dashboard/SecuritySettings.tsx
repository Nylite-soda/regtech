// components/dashboard/SecuritySettings.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Shield, Lock, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { Company, UserData } from "@/types";
import { BASE_URL, logout, storeRedirectUrl } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-context";
import { validatePassword } from "@/lib/validation";
import { useRouter } from "next/navigation";

interface SecuritySettingsProps {
  user?: UserData;
  company?: Company;
}

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

export default function SecuritySettings({
  user,
  company,
}: SecuritySettingsProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PasswordFormData>({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  // Determine if we're working with a user or company account
  const accountType = user ? "user" : "company";
  const accountId = user ? user.id : company?.id;
  const accountName = user ? user.first_name || user.email : company?.name;

  const onSubmit = async (data: PasswordFormData) => {
    setError("");

    // Validate password
    const passwordError = validatePassword(data.new_password);
    if (passwordError) {
      setError(passwordError.message);
      return;
    }

    // Check if passwords match
    if (data.new_password !== data.confirm_new_password) {
      setError("New passwords do not match!");
      showToast("New passwords do not match.", "error");
      return;
    }

    // Check password length
    if (data.new_password.length < 8) {
      setError("Password must be at least 8 characters long.");
      showToast("Password must be at least 8 characters long.", "error");
      return;
    }

    try {
      // Use different endpoints based on account type
      const endpoint = user
        ? `${BASE_URL}/api/v1/user/change-password`
        : `${BASE_URL}/api/v1/company/change-password`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        if (
          result.detail &&
          result.detail === "Could not validate credentials!"
        ) {
          showToast("Token has expired! Please sign in!", "info");
          logout();
          storeRedirectUrl();
          router.push("/auth/signin");
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || "Password change failed");
      }

      showToast("Password updated successfully!", "success");
      reset();
    } catch (error: any) {
      setError(error.message || "Password change failed");
      showToast(error.message || "Password change failed", "error");
    }
  };

  // If neither user nor company is provided, show a message
  if (!user && !company) {
    return (
      <SectionWrapper
        icon={<Shield className="w-5 h-5" />}
        title="Security Settings"
      >
        <div className="p-4 text-amber-700 bg-amber-50 rounded-md">
          No account information available.
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper
      icon={<Shield className="w-5 h-5" />}
      title="Security Settings"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <h3 className="font-medium">
          Change Password for {accountType === "user" ? "User" : "Company"}:{" "}
          {accountName}
        </h3>
        <div className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("current_password", { required: true })}
              placeholder="Current Password"
              className="w-full p-3 border rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            {...register("new_password", { required: true })}
            placeholder="New Password"
            className="w-full p-3 border rounded-lg"
          />

          <input
            type={showPassword ? "text" : "password"}
            {...register("confirm_new_password", { required: true })}
            placeholder="Confirm New Password"
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-[#AD0000] text-white rounded-lg flex items-center"
          >
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </button>
        </div>
        {error && (
          <div className="p-3 mt-2 rounded-md flex items-center gap-2 bg-red-100 text-red-800">
            <ShieldAlert className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </SectionWrapper>
  );
}

const SectionWrapper = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h2>
    {children}
  </div>
);
