"use client";
import { useForm } from "react-hook-form";
import { User, Save, Upload } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-context";
import { BASE_URL } from "@/lib/utils";
import { SectionWrapper } from "../SectionWrapper";
import { UserData } from "@/types";
import * as z from "zod";
import { useState } from "react";
import Router from "next/router";

// Validation schema
const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .regex(/^\d{10,15}$/, "Phone number must be 10-15 digits")
    .optional()
    .or(z.literal("")),
  avatar: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileSectionProps {
  userData: UserData;
}

export function ProfileSection({ userData }: ProfileSectionProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone_number: userData.phone_number?.toString() || "",
    },
  });

  // Preview state for avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    userData.avatar || null
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file change with base64 conversion
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setError("avatar", {
          message: "Image size must be less than 2MB",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("avatar", {
          message: "Only image files are allowed",
        });
        return;
      }

      setIsUploading(true);

      try {
        // Convert to base64
        const base64 = await fileToBase64(file);

        // Set the value in the form
        setValue("avatar", base64);

        // Show preview
        setAvatarPreview(base64);
      } catch (error) {
        setError("avatar", {
          message: "Failed to process image. Please try again.",
        });
      } finally {
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error handling file:", error);
      setError("avatar", {
        message: "Something went wrong with the image upload",
      });
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Create payload type with proper structure
      type ProfilePayload = {
        first_name: string;
        last_name: string;
        email: string;
        phone_number?: string;
        avatar?: string;
      };

      const payload: ProfilePayload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      };

      // Only add optional fields if they exist
      if (data.phone_number) {
        payload.phone_number = data.phone_number;
      }

      if (data.avatar) {
        payload.avatar = data.avatar;
      }

      const response = await fetch(`${BASE_URL}/api/v1/users/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Try to get detailed error message
        let errorMessage = "Profile update failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;

          // Handle specific error cases
          if (response.status === 409) {
            errorMessage = "This email is already in use by another account";
          }
          if (response.status === 401) {
            errorMessage = "Your session has expired. Please log in again";
            // Handle logout or redirect to login
            router.push("/login");
            return;
          }
        } catch (e) {
          // If we can't parse the error, use status text
          errorMessage = `Error: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      showToast("Your profile has been updated successfully!", "success");
      Router.reload(); // Refresh to get updated data
    } catch (error: any) {
      if (
        error.message?.includes("network") ||
        error.message?.includes("fetch")
      ) {
        showToast(
          "Network error. Please check your connection and try again.",
          "error"
        );
      } else {
        showToast(error.message || "An unexpected error occurred", "error");
      }
      setError("root", {
        message: error.message || "Failed to update profile",
      });
    }
  };

  return (
    <SectionWrapper
      icon={<User className="w-5 h-5" />}
      title="Profile Information"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar Upload */}
          <div className="md:col-span-2 flex items-center gap-6">
            <div className="relative">
              <img
                src={avatarPreview || "/images/default-avatar.png"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-100 ${
                  isUploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                ) : (
                  <Upload className="w-4 h-4 text-gray-600" />
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            </div>
            <div>
              <p className="font-medium">Profile Photo</p>
              <p className="text-sm text-gray-500">
                JPG, GIF or PNG. Max size 2MB
              </p>
              {errors.avatar && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.avatar.message}
                </p>
              )}
            </div>
          </div>

          {/* First Name */}
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              className={`w-full p-3 border rounded-lg ${
                errors.first_name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:border-transparent focus:ring-2 focus:outline-none transition`}
              {...register("first_name")}
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.first_name.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              className={`w-full p-3 border rounded-lg ${
                errors.last_name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:border-transparent focus:ring-2 focus:outline-none transition`}
              {...register("last_name")}
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.last_name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full p-3 border rounded-lg ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:border-transparent focus:ring-2 focus:outline-none transition`}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              id="phone_number"
              type="tel"
              placeholder="e.g., 1234567890"
              className={`w-full p-3 border rounded-lg ${
                errors.phone_number
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:border-transparent focus:ring-2 focus:outline-none transition`}
              {...register("phone_number")}
            />
            {errors.phone_number && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone_number.message}
              </p>
            )}
          </div>
        </div>

        {/* Form Error */}
        {errors.root && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200 flex items-start">
            <svg
              className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>{errors.root.message}</div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-4 py-2 bg-[#AD0000] text-white rounded-lg flex items-center hover:bg-[#AD0000]/90 disabled:opacity-70 transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </SectionWrapper>
  );
}
