"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ProfileCompletionModal from "@/components/company/ProfileCompletionModal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BASE_URL,
  isUserSignedIn,
  logout,
  storeRedirectUrl,
} from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Users,
  Building2,
  Globe,
  Mail,
  Phone,
  Link as LinkIcon,
  Plus,
  X,
  Instagram,
  Linkedin,
} from "lucide-react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@mui/x-date-pickers/icons";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Twitter from "@/components/ui/Twitter";
import ProfileProgressBar from "@/components/company/ProfileProgressBar";
import { CompanyFounder, CompanyService } from "@/types";
import Router from "next/router";
import MarkdownIt from "markdown-it";
import MDEditor from "@uiw/react-md-editor";
import TabNavigation from "../ui/TabNavigation";

interface CompanyProfile {
  id: string;
  company_name: string;
  company_email: string;
  company_phone?: string;
  company_website: string;
  description: string;
  company_type: string;
  company_size: string;
  year_founded: string;
  headquarters: string;
  founder: CompanyFounder[];
  niche: string;
  last_funding: string;
  services: CompanyService[];
  logo: string;
  social_media: { platform: string; url: string }[];
  profile_completion: number;
}

interface Social {
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  // typographer: true
});

// Mapping between our form structure and the backend schema
const mapFormDataToApiData = (formData: CompanyProfile) => {
  return {
    company_name: formData.company_name,
    company_email: formData.company_email,
    company_phone: formData.company_phone,
    company_website: formData.company_website,
    description: formData.description,
    company_type: formData.company_type,
    niche: formData.niche,
    last_funding_date: formData.last_funding,
    company_size: formData.company_size,
    year_founded: formData.year_founded
      ? parseInt(formData.year_founded)
      : null,
    headquarters: formData.headquarters,
    founders: formData.founder.map((founder) => ({
      name: founder.name,
      role: founder.role || null,
      bio: founder.bio || null,
      avatar: founder.avatar || null,
      social: founder.social || null,
    })),
    services: formData.services.filter((s) => s.name.trim() !== ""),
    logo: formData.logo,
    social_media_linkedIn:
      formData.social_media.find((s) => s.platform === "LinkedIn")?.url || null,
    social_media_ig:
      formData.social_media.find((s) => s.platform === "Instagram")?.url ||
      null,
    social_media_X:
      formData.social_media.find((s) => s.platform === "X")?.url || null,
  };
};

export default function CompanyProfile() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [nextActions, setNextActions] = useState<
    { text: string; priority: string }[]
  >([]);

  const [formData, setFormData] = useState<CompanyProfile>({
    id: "",
    company_name: "",
    company_email: "",
    company_phone: "",
    company_website: "",
    description: "",
    company_type: "",
    company_size: "",
    year_founded: "",
    headquarters: "",
    niche: "",
    last_funding: "",
    founder: [],
    services: [],
    logo: "",
    social_media: [] as { platform: string; url: string }[],
    profile_completion: 0,
  });

  const [previewMode, setPreviewMode] = useState({
    description: false,
    services: Array(formData.services.length).fill(false),
  });

  const theme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const company_id = localStorage.getItem("company_id");
        if (!accessToken) {
          showToast("Please log in to access your profile", "error");
          router.push("/auth/company-login");
          return;
        }

        setLoading(true);
        const response = await fetch(
          `${BASE_URL}/api/v1/company/${company_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const result = await response.json();
          if (
            isUserSignedIn() &&
            result.detail &&
            result.detail === "Could not validate credentials!"
          ) {
            showToast("Token has expired! Please sign in!", "info");
            storeRedirectUrl();
            router.push("/auth/company-login");
            return;
          } else if (!isUserSignedIn()) {
            showToast("Token has expired! Please sign in!", "info");
            storeRedirectUrl();
            router.push("/auth/signin");
            return;
          }
          const errorMessage =
            result.detail ===
            "Failed to create company: 400: Company with this email already exists"
              ? "Company with this email already exists"
              : result.error || result.message || "Registration failed";
          throw new Error(errorMessage);
        }

        if (response.ok) {
          const predata = await response.json();
          const data = predata.data;
          setCompanyId(data.id);

          // Transform API data to form structure
          const transformedData = {
            id: data.id,
            company_name: data.name || "",
            company_email: data.email || "",
            company_phone: data.phone || "",
            company_website: data.website || "",
            description: data.description || "",
            company_type: data.company_type || "",
            company_size: data.company_size || "",
            year_founded: data.year_founded || "N/A",
            headquarters: data.headquarters || "",
            founder: data.founders || [],
            services: data.services || [],
            niche: data.niche || "",
            last_funding: data.last_funding_date || "",
            logo: data.logo || "",
            social_media: [] as { platform: string; url: string }[],
            profile_completion: data.profile_completion || 0,
          };

          // Add social media
          if (data.social_media_linkedIn) {
            transformedData.social_media.push({
              platform: "LinkedIn",
              url: data.social_media_linkedIn,
            });
          }
          if (data.social_media_ig) {
            transformedData.social_media.push({
              platform: "Instagram",
              url: data.social_media_ig,
            });
          }
          if (data.social_media_X) {
            transformedData.social_media.push({
              platform: "X",
              url: data.social_media_X,
            });
          }

          setFormData(transformedData);
          updateNextActions(transformedData);
          // Set date for year founded if available
          if (transformedData.year_founded) {
            setDate(dayjs(transformedData.year_founded));
          }
        } else {
          showToast("Failed to load company profile", "error");
        }
      } catch (error) {
        console.error("Error fetching company profile:", error);
        showToast("An error occurred while loading your profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [router, showToast, isSubmitted]);

  const updateNextActions = (data: CompanyProfile) => {
    const actions: { text: string; priority: string }[] = [];

    // Check for missing required fields and add them as actions
    if (!data.company_name)
      actions.push({ text: "Add company name", priority: "high" });
    if (!data.company_email)
      actions.push({ text: "Add company email", priority: "high" });
    if (!data.company_phone)
      actions.push({ text: "Add phone number", priority: "medium" });
    if (!data.company_website)
      actions.push({ text: "Add website", priority: "medium" });
    if (!data.description)
      actions.push({ text: "Add company description", priority: "high" });
    if (!data.logo)
      actions.push({ text: "Upload company logo", priority: "medium" });
    if (!data.company_type)
      actions.push({ text: "Select company type", priority: "medium" });
    if (!data.headquarters)
      actions.push({ text: "Add headquarters location", priority: "medium" });
    if (!data.founder.some((founder) => founder.name.trim()))
      actions.push({ text: "Add at least one founder", priority: "high" });
    if (!data.year_founded)
      actions.push({ text: "Add founding year", priority: "medium" });
    if (!data.company_size)
      actions.push({ text: "Select company size", priority: "low" });
    if (!data.niche)
      actions.push({ text: "Select company niche", priority: "high" });
    if (!data.services)
      actions.push({ text: "Add services offered", priority: "high" });
    if (data.social_media.length === 0)
      actions.push({
        text: "Add at least one social media profile",
        priority: "low",
      });

    // Sort by priority: high, medium, low
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    actions.sort(
      (a, b) =>
        priorityOrder[a.priority as keyof typeof priorityOrder] -
        priorityOrder[b.priority as keyof typeof priorityOrder]
    );

    setNextActions(actions);
  };

  const handleMarkdownChange = (field: string, value: string, index = null) => {
    if (index !== null) {
      // Handle service description
      updateServiceField(index, field, value);
    } else {
      // Handle main description
      handleChange({ target: { name: field, value } });
    }
  };

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user makes a selection
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        logo: "Logo image must be less than 5MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        logo: base64String,
      }));

      // Clear error for this field when user uploads a file
      if (formErrors.logo) {
        setFormErrors((prev) => ({
          ...prev,
          logo: "",
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const addSocialMedia = (platform: string) => {
    // Check if this platform already exists
    const exists = formData.social_media.some(
      (item) => item.platform === platform
    );

    if (!exists) {
      setFormData((prev) => ({
        ...prev,
        social_media: [...prev.social_media, { platform, url: "" }],
      }));
    }
  };

  const removeSocialMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      social_media: prev.social_media.filter((_, i) => i !== index),
    }));
  };

  const updateSocialMediaUrl = (index: number, url: string) => {
    const updatedSocialMedia = [...formData.social_media];
    updatedSocialMedia[index].url = url;

    setFormData((prev) => ({
      ...prev,
      social_media: updatedSocialMedia,
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Required fields validation
    const requiredFields = [
      "company_name",
      "company_email",
      "company_website",
      "description",
      "company_type",
      "company_size",
      "year_founded",
      "headquarters",
      "founder",
      "niche",
      "services",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = `${
          field.charAt(0).toUpperCase() +
          field.slice(1).replace(/([A-Z])/g, " $1")
        } is required`;
      }
    });

    // Email validation
    if (
      formData.company_email &&
      !/\S+@\S+\.\S+/.test(formData.company_email)
    ) {
      errors.company_email = "Please enter a valid email address";
    }

    // Website validation
    if (
      formData.company_website &&
      !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(
        formData.company_website
      )
    ) {
      errors.company_website = "Please enter a valid website URL";
    }

    // Founders validation
    if (!formData.founder.length) {
      errors.founder = "At least one founder is required";
    } else {
      formData.founder.forEach((founder, index) => {
        if (!founder.name.trim()) {
          errors[`founder_${index}_name`] = "Founder name is required";
        }
      });
    }

    // Services validation
    formData.services.forEach((service, index) => {
      if (!service.name.trim()) {
        errors[`services_${index}_name`] = "Service name is required";
      }
    });

    if (formData.services.length === 0) {
      errors.services = "At least one service is required";
    }
    if (
      !formData.services.length ||
      formData.services.some((s) => !s.name.trim())
    ) {
      errors.services = "At least one service with name is required";
    }

    // Social media validation
    formData.social_media.forEach((social, index) => {
      if (social.url && !isValidSocialMediaUrl(social.platform, social.url)) {
        errors[
          `social_media_${index}`
        ] = `Please enter a valid ${social.platform} URL`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidSocialMediaUrl = (platform: string, url: string) => {
    switch (platform) {
      case "LinkedIn":
        return /^(https?:\/\/)?(www\.)?linkedin\.com\/.*/.test(url);
      case "Instagram":
        return /^(https?:\/\/)?(www\.)?instagram\.com\/.*/.test(url);
      case "X":
        return /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.*/.test(url);
      default:
        return true;
    }
  };

  const updateFounderField = (index: number, field: string, value: string) => {
    const updatedFounders = [...formData.founder];
    updatedFounders[index] = { ...updatedFounders[index], [field]: value };
    setFormData((prev) => ({ ...prev, founder: updatedFounders }));
  };

  const updateFounderSocialField = (
    index: number,
    platform: keyof Social,
    value: string
  ) => {
    const updatedFounders = [...formData.founder];
    updatedFounders[index] = {
      ...updatedFounders[index],
      social: {
        ...updatedFounders[index].social,
        [platform]: value,
      },
    };
    setFormData((prev) => ({ ...prev, founder: updatedFounders }));
  };

  const handleFounderAvatarUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB for avatars)
    if (file.size > 2 * 1024 * 1024) {
      showToast("Avatar image must be less than 2MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateFounderField(index, "avatar", base64String);
    };
    reader.readAsDataURL(file);
  };

  const updateServiceField = (index: number, field: string, value: string) => {
    const updatedServices = [...formData.services];
    if (!updatedServices[index]) return; // Prevent crashing
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, services: updatedServices }));
  };

  const calculateProfileCompletion = () => {
    const totalFields = 15; // Total number of fields to complete
    let completedFields = 0;

    // Check each field
    if (formData.company_name) completedFields++;
    if (formData.company_email) completedFields++;
    if (formData.company_phone) completedFields++;
    if (formData.company_website) completedFields++;
    if (formData.description) completedFields++;
    if (formData.company_type) completedFields++;
    if (formData.company_size) completedFields++;
    if (formData.year_founded) completedFields++;
    if (formData.headquarters) completedFields++;
    if (
      formData.founder.length > 0 &&
      formData.founder.every((f) => f.name.trim())
    )
      completedFields++;
    if (formData.niche) completedFields++;
    if (formData.last_funding) completedFields++;
    if (
      formData.services.length > 0 &&
      formData.services.every((s) => s.name.trim())
    )
      completedFields++;
    if (formData.logo) completedFields++;
    if (formData.social_media.length > 0) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!validateForm()) {
      setSaving(false);
      const errorFields = Object.keys(formErrors)
        .map(
          (key) =>
            key.charAt(0).toUpperCase() +
            key.slice(1).replace(/([A-Z])/g, " $1")
        )
        .join(", ");

      showToast(`Please fill in all required fields: ${errorFields}`, "error");
      return;
    }

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        showToast("Please log in to update your profile", "error");
        storeRedirectUrl();
        router.push("/auth/signin");
        return;
      }

      // Calculate profile completion percentage
      const profileCompletion = calculateProfileCompletion();

      // Map form data to API schema format
      const apiData = mapFormDataToApiData(formData);

      // Make the API request with the bearer token
      const response = await fetch(`${BASE_URL}/api/v1/company/${companyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(apiData), // Send the data directly, not wrapped in apiData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Profile update failed"
        );
      }

      // Update local form data with new completion percentage
      setFormData((prev) => ({
        ...prev,
        profile_completion: profileCompletion,
      }));

      // Update next actions
      updateNextActions({
        ...formData,
        profile_completion: profileCompletion,
      });

      showToast("Profile updated successfully!", "success");
      setIsSubmitted(true);
      // If profile is now 100% complete, show completion modal
      if (profileCompletion === 100) {
        setIsCompletionModalOpen(true);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again later.";
      showToast(errorMessage, "error");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCompletionModalClose = () => {
    setIsCompletionModalOpen(false);
    router.push(`/dashboard/company/${localStorage.getItem("company_id")}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Company Profile</h1>
      {/* Profile Progress Bar */}
      <ProfileProgressBar formData={formData} className="mb-8" />
      <ProfileCompletionModal
        isOpen={isCompletionModalOpen}
        onClose={handleCompletionModalClose}
      />

      <form className="space-y-8" onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="w-full">
          {/* Mobile view - compact grid layout */}
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full md:hidden mb-6 bg-transparent p-0">
            <TabsTrigger
              value="basic"
              className={`tabButton h-10 data-[state=active]:bg-[#AD0000] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 border-none`}
            >
              Basic Information
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className={`tabButton h-10 data-[state=active]:bg-[#AD0000] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 border-none`}
            >
              Company Details
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className={`tabButton h-10 data-[state=active]:bg-[#AD0000] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 border-none`}
            >
              Social Media
            </TabsTrigger>
          </TabsList>

          {/* Tablet/Desktop view - traditional tabs */}
          <TabsList className="hidden md:flex w-full border-b border-gray-200 bg-transparent p-0 h-auto rounded-none flex-wrap">
            <TabsTrigger
              value="basic"
              className={`pb-4 px-4 border-b-2 rounded-none font-medium text-sm h-auto data-[state=active]:border-[#AD0000] data-[state=active]:text-[#AD0000] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300`}
            >
              Basic Information
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className={`pb-4 px-4 border-b-2 rounded-none font-medium text-sm h-auto data-[state=active]:border-[#AD0000] data-[state=active]:text-[#AD0000] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300`}
            >
              Company Details
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className={`pb-4 px-4 border-b-2 rounded-none font-medium text-sm h-auto data-[state=active]:border-[#AD0000] data-[state=active]:text-[#AD0000] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:hover:border-gray-300`}
            >
              Social Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            {/* Company Name */}
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                name="company_name"
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => handleChange(e)}
                className={`mt-1 ${
                  formErrors.company_name ? "border-red-500" : ""
                }`}
                placeholder="Your Company Ltd."
              />
              {formErrors.company_name && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.company_name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <Label htmlFor="company_email">Email address</Label>
              <Input
                id="company_email"
                name="company_email"
                type="email"
                autoComplete="email"
                required
                value={formData.company_email}
                onChange={(e) => handleChange(e)}
                className={`mt-1 ${
                  formErrors.company_email ? "border-red-500" : ""
                }`}
                placeholder="company@example.com"
              />
              {formErrors.company_email && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.company_email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="company_phone">Phone Number</Label>
              <Input
                id="company_phone"
                name="company_phone"
                type="tel"
                required
                value={formData.company_phone}
                onChange={(e) => handleChange(e)}
                className={`mt-1 ${
                  formErrors.company_phone ? "border-red-500" : ""
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {formErrors.company_phone && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.company_phone}
                </p>
              )}
            </div>

            {/* Description with Markdown */}

            <label htmlFor="description" className="pb-4">
              Description
            </label>

            <div
              className="rounded-md border border-gray-300 dark:border-gray-600"
              data-color-mode={theme} // theme = "light" or "dark"
            >
              <MDEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value || "" }))
                }
                height={300}
                preview="edit"
                textareaProps={{
                  placeholder: "Briefly describe your company...",
                }}
              />
            </div>

            {formErrors.description && (
              <p className="text-xs text-red-600" id="markdown-error">
                {formErrors.description}
              </p>
            )}

            {/* Website */}
            <div>
              <Label htmlFor="company_website" className="mb-2 mt-2">
                Website
              </Label>
              <Input
                id="company_website"
                name="company_website"
                type="text"
                required
                value={formData.company_website}
                onChange={(e) => handleChange(e)}
                className={`mt-1 ${
                  formErrors.company_website ? "border-red-500" : ""
                }`}
                placeholder="https://www.yourcompany.com"
              />
              {formErrors.company_website && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.company_website}
                </p>
              )}
            </div>

            {/* Logo Upload */}
            <div>
              <Label htmlFor="logo" className="mb-2 mt-2">
                Company Logo
              </Label>
              <div className="mt-1 flex items-center">
                {formData.logo ? (
                  <div className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-200">
                    <Image
                      src={formData.logo}
                      alt="Company logo preview"
                      layout="fill"
                      objectFit="contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          logo: "",
                        }));
                      }}
                      className="absolute right-1 top-1 rounded-full bg-white p-1 text-gray-500 shadow-sm hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex h-20 w-20 items-center justify-center rounded-md border-dashed"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                )}
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="ml-5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Logo
                  </Button>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
              {formErrors.logo && (
                <p className="mt-1 text-sm text-red-600">{formErrors.logo}</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            {/* Company Type */}
            <div>
              <Label htmlFor="company_type" className="mb-2 mt-2">
                Company Type
              </Label>
              <Select
                value={formData.company_type}
                onValueChange={(value) =>
                  handleSelectChange("company_type", value)
                }
              >
                <SelectTrigger
                  className={`w-full ${
                    formErrors.company_type ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select company type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Startup">Startup</SelectItem>
                    <SelectItem value="SME">SME</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                    <SelectItem value="Public">Public Company</SelectItem>
                    <SelectItem value="NGO">NGO/Non-profit</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formErrors.company_type && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.company_type}
                </p>
              )}
            </div>

            {/* Headquarters */}
            <div>
              <Label htmlFor="headquarters" className="mb-2 mt-2">
                Headquarters
              </Label>
              <Input
                id="headquarters"
                name="headquarters"
                type="text"
                required
                value={formData.headquarters}
                onChange={(e) => handleChange(e)}
                className={`mt-1 ${
                  formErrors.headquarters ? "border-red-500" : ""
                }`}
                placeholder="City, Country"
              />
              {formErrors.headquarters && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.headquarters}
                </p>
              )}
            </div>

            {/* Founder */}
            <div>
              <Label htmlFor="founder" className="mb-2 mt-2">
                Founder(s)
              </Label>
              <div className="space-y-4">
                {formData.founder.map((founder, index) => (
                  <div key={index} className="space-y-4 border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Founder #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFounders = [...formData.founder];
                          newFounders.splice(index, 1);
                          setFormData((prev) => ({
                            ...prev,
                            founder: newFounders,
                          }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Name */}
                    <div>
                      <Label className="mb-2">Full Name*</Label>
                      <Input
                        value={founder.name}
                        onChange={(e) =>
                          updateFounderField(index, "name", e.target.value)
                        }
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <Label className="mb-2">Role/Position</Label>
                      <Input
                        value={founder.role || ""}
                        onChange={(e) =>
                          updateFounderField(index, "role", e.target.value)
                        }
                        placeholder="CEO, Co-founder, etc."
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <Label className="mb-2">Bio</Label>
                      <Textarea
                        value={founder.bio || ""}
                        onChange={(e) =>
                          updateFounderField(index, "bio", e.target.value)
                        }
                        placeholder="Brief background about the founder..."
                      />
                    </div>

                    {/* Avatar Upload */}
                    <div>
                      <Label className="mb-2">Avatar</Label>
                      <div className="flex items-center gap-4">
                        {founder.avatar ? (
                          <div className="relative h-16 w-16 rounded-xl overflow-hidden border">
                            <Image
                              src={founder.avatar}
                              alt={`${founder.name}'s avatar`}
                              layout="fill"
                              objectFit="cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateFounderField(index, "avatar", "")
                              }
                              className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-sm"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document
                                .getElementById(`founder-avatar-${index}`)
                                ?.click()
                            }
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Upload
                          </Button>
                        )}
                        <input
                          type="file"
                          id={`founder-avatar-${index}`}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFounderAvatarUpload(index, e)}
                        />
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="space-y-2">
                      <Label>Social Media</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <Twitter className="h-4 w-4" />
                          <Input
                            value={founder.social?.twitter || ""}
                            onChange={(e) =>
                              updateFounderSocialField(
                                index,
                                "twitter",
                                e.target.value
                              )
                            }
                            placeholder="Twitter URL"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4" />
                          <Input
                            value={founder.social?.linkedin || ""}
                            onChange={(e) =>
                              updateFounderSocialField(
                                index,
                                "linkedin",
                                e.target.value
                              )
                            }
                            placeholder="LinkedIn URL"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Instagram className="h-4 w-4" />
                          <Input
                            value={founder.social?.instagram || ""}
                            onChange={(e) =>
                              updateFounderSocialField(
                                index,
                                "instagram",
                                e.target.value
                              )
                            }
                            placeholder="Instagram URL"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      founder: [
                        ...prev.founder,
                        { name: "", role: "", bio: "", avatar: "", social: {} },
                      ],
                    }))
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Founder
                </Button>
              </div>
            </div>

            {/* Year Founded */}
            <div>
              <Label htmlFor="year_founded" className="mb-2 mt-2">
                Year Founded
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      !formData.year_founded && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.year_founded || <span>Select year</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateCalendar"]}>
                      <DemoItem>
                        <DateCalendar
                          maxDate={dayjs()}
                          value={date}
                          onChange={(newDate) => {
                            if (newDate) {
                              setDate(newDate);
                              handleChange({
                                target: {
                                  name: "year_founded",
                                  value: newDate.format("YYYY"),
                                },
                              });
                            }
                          }}
                          views={["year"]}
                          openTo="year"
                          sx={{
                            width: "100%",
                            height: "auto",
                            "& .MuiPickersCalendarHeader-root": {
                              paddingLeft: "16px",
                              paddingRight: "16px",
                              marginTop: "8px",
                            },
                            "& .MuiDayCalendar-header": {
                              paddingLeft: "16px",
                              paddingRight: "16px",
                            },
                            "& .MuiDayCalendar-monthContainer": {
                              paddingLeft: "16px",
                              paddingRight: "16px",
                              paddingBottom: "16px",
                            },
                            "& .MuiPickersDay-root.Mui-selected": {
                              backgroundColor: "#AD0000",
                            },
                            "& .MuiPickersDay-root.Mui-selected:hover": {
                              backgroundColor: "#890000",
                            },
                            "& .MuiPickersDay-root.Mui-selected:focus": {
                              backgroundColor: "#AD0000",
                            },
                            "& .MuiDateCalendar-root .MuiButtonBase-root.MuiPickersDay-root:not(.Mui-selected):hover":
                              {
                                backgroundColor: "rgba(173, 0, 0, 0.1)",
                              },
                            "& .MuiDateCalendar-root .MuiButtonBase-root.MuiPickersDay-root:focus":
                              {
                                backgroundColor: "rgba(173, 0, 0, 0.2)",
                              },
                            "& .MuiPickersCalendarHeader-switchViewButton": {
                              color: "#AD0000",
                            },
                            "& .MuiPickersArrowSwitcher-button": {
                              color: "#AD0000",
                            },
                            "& .MuiYearCalendar-root .MuiPickersYear-yearButton.Mui-selected":
                              {
                                backgroundColor: "#AD0000",
                              },
                            "& .MuiYearCalendar-root .MuiPickersYear-yearButton:not(.Mui-selected):hover":
                              {
                                backgroundColor: "rgba(173, 0, 0, 0.1)",
                              },
                          }}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </PopoverContent>
              </Popover>
              {formErrors.year_founded && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.year_founded}
                </p>
              )}
            </div>

            {/* Company Size */}
            <div>
              <Label htmlFor="company_size" className="mb-2 mt-2">
                Company Size
              </Label>
              <Select
                value={formData.company_size}
                onValueChange={(value) =>
                  handleSelectChange("company_size", value)
                }
              >
                <SelectTrigger
                  className={`w-full ${
                    formErrors.company_size ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1-10">1 to 10</SelectItem>
                    <SelectItem value="11-50">11 to 50</SelectItem>
                    <SelectItem value="51-200">51 to 200</SelectItem>
                    <SelectItem value="201-500">201 to 500</SelectItem>
                    <SelectItem value="501-1000">501 to 1000</SelectItem>
                    <SelectItem value="1000+">Over 1000</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formErrors.company_size && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.company_size}
                </p>
              )}
            </div>

            {/* Company Niche */}
            <div>
              <Label htmlFor="niche" className="mb-2 mt-2">
                Company Niche
              </Label>
              <Select
                value={formData.niche}
                onValueChange={(value) => handleSelectChange("niche", value)}
              >
                <SelectTrigger
                  className={`w-full ${
                    formErrors.niche ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select your niche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="AML">AML</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="KYC">KYC</SelectItem>
                    <SelectItem value="Regulatory">Regulatory</SelectItem>
                    <SelectItem value="SupTech">SupTech</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formErrors.niche && (
                <p className="mt-1 text-sm text-red-600">{formErrors.niche}</p>
              )}
            </div>

            {/* Services with Markdown */}
            {/* Services Section */}
            <div>
              <Label htmlFor="services" className="mb-2 mt-2">
                Services Offered
              </Label>
              <div className="space-y-4">
                {formData.services.map((service, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                  >
                    <div className="flex gap-2 items-center mb-4">
                      <Input
                        placeholder="Service Name *"
                        value={service.name}
                        onChange={(e) => {
                          updateServiceField(index, "name", e.target.value);
                          if (formErrors[`services_${index}_name`]) {
                            setFormErrors((prev) => ({
                              ...prev,
                              [`services_${index}_name`]: "",
                            }));
                          }
                        }}
                        className={`font-medium ${
                          formErrors[`services_${index}_name`]
                            ? "border-red-500"
                            : ""
                        }`}
                        autoFocus={service.name === ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newServices = [...formData.services];
                          newServices.splice(index, 1);
                          setFormData((prev) => ({
                            ...prev,
                            services: newServices,
                          }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {formErrors[`services_${index}_name`] && (
                      <p className="text-red-500 text-sm mt-1 mb-2">
                        {formErrors[`services_${index}_name`]}
                      </p>
                    )}

                    <label
                      htmlFor="service-description"
                      className=" text-base mt-1"
                    >
                      Service Description
                    </label>
                    <div
                      className="rounded-md border border-gray-300 dark:border-gray-600"
                      data-color-mode={theme} // theme = "light" or "dark"
                    >
                      <MDEditor
                        className="p-2"
                        value={service.description || ""}
                        onChange={(value) =>
                          updateServiceField(index, "description", value || "")
                        }
                        preview="edit"
                        height={200}
                        textareaProps={{
                          placeholder:
                            "Briefly describe your service or product and what problem it solves",
                        }}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      services: [
                        ...prev.services,
                        { name: "", description: "" },
                      ],
                    }))
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </div>
            </div>

            {/* Funding Round */}
            <div>
              <Label htmlFor="last_funding" className="mb-2 mt-2">
                Last Funding Round
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      !formData.last_funding && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.last_funding ? (
                      dayjs(formData.last_funding).format("MMM D, YYYY")
                    ) : (
                      <span>Select funding date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateCalendar"]}>
                      <DemoItem>
                        <DateCalendar
                          maxDate={dayjs()}
                          value={
                            formData.last_funding
                              ? dayjs(formData.last_funding)
                              : null
                          }
                          onChange={(newDate) => {
                            if (newDate) {
                              handleChange({
                                target: {
                                  name: "last_funding",
                                  value: newDate.format("YYYY-MM-DD"),
                                },
                              });
                            }
                          }}
                          sx={{
                            width: "100%",
                            height: "auto",
                            "& .MuiPickersCalendarHeader-root": {
                              paddingLeft: "16px",
                              paddingRight: "16px",
                              marginTop: "8px",
                            },
                            "& .MuiDayCalendar-header": {
                              paddingLeft: "16px",
                              paddingRight: "16px",
                            },
                            "& .MuiDayCalendar-monthContainer": {
                              paddingLeft: "16px",
                              paddingRight: "16px",
                              paddingBottom: "16px",
                            },
                            "& .MuiPickersDay-root.Mui-selected": {
                              backgroundColor: "#AD0000",
                            },
                            "& .MuiPickersDay-root.Mui-selected:hover": {
                              backgroundColor: "#890000",
                            },
                            "& .MuiPickersDay-root.Mui-selected:focus": {
                              backgroundColor: "#AD0000",
                            },
                            "& .MuiDateCalendar-root .MuiButtonBase-root.MuiPickersDay-root:not(.Mui-selected):hover":
                              {
                                backgroundColor: "rgba(173, 0, 0, 0.1)",
                              },
                            "& .MuiDateCalendar-root .MuiButtonBase-root.MuiPickersDay-root:focus":
                              {
                                backgroundColor: "rgba(173, 0, 0, 0.2)",
                              },
                            "& .MuiPickersCalendarHeader-switchViewButton": {
                              color: "#AD0000",
                            },
                            "& .MuiPickersArrowSwitcher-button": {
                              color: "#AD0000",
                            },
                            "& .MuiYearCalendar-root .MuiPickersYear-yearButton.Mui-selected":
                              {
                                backgroundColor: "#AD0000",
                              },
                            "& .MuiYearCalendar-root .MuiPickersYear-yearButton:not(.Mui-selected):hover":
                              {
                                backgroundColor: "rgba(173, 0, 0, 0.1)",
                              },
                          }}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </PopoverContent>
              </Popover>
              {formErrors.last_funding && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.last_funding}
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4 mt-4">
            {/* Social Media */}
            <div>
              <Label htmlFor="social" className="mb-2 mt-2">
                Social Media
              </Label>
              <div className="mt-2 space-y-4">
                {/* Available platforms */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`flex items-center ${
                      formData.social_media.some(
                        (s) => s.platform === "LinkedIn"
                      )
                        ? "bg-blue-50 text-blue-700"
                        : ""
                    }`}
                    onClick={() => addSocialMedia("LinkedIn")}
                    disabled={formData.social_media.some(
                      (s) => s.platform === "LinkedIn"
                    )}
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`flex items-center ${
                      formData.social_media.some(
                        (s) => s.platform === "Instagram"
                      )
                        ? "bg-pink-50 text-pink-700"
                        : ""
                    }`}
                    onClick={() => addSocialMedia("Instagram")}
                    disabled={formData.social_media.some(
                      (s) => s.platform === "Instagram"
                    )}
                  >
                    <Instagram className="mr-2 h-4 w-4" />
                    Instagram
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`flex items-center ${
                      formData.social_media.some((s) => s.platform === "X")
                        ? "bg-gray-100 text-gray-900"
                        : ""
                    }`}
                    onClick={() => addSocialMedia("X")}
                    disabled={formData.social_media.some(
                      (s) => s.platform === "X"
                    )}
                  >
                    <Twitter className="mr-2 h-4 w-4" />X
                  </Button>
                </div>

                {/* Added social media inputs */}
                {formData.social_media.length > 0 && (
                  <div className="space-y-2 rounded-md border border-gray-200 p-3">
                    {formData.social_media.map((social, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex w-24 flex-shrink-0 items-center">
                          {social.platform === "LinkedIn" && (
                            <Linkedin className="mr-2 h-4 w-4" />
                          )}
                          {social.platform === "Instagram" && (
                            <Instagram className="mr-2 h-4 w-4" />
                          )}
                          {social.platform === "X" && (
                            <Twitter className="mr-2 h-4 w-4" />
                          )}
                          <span className="text-sm">{social.platform}:</span>
                        </div>
                        <Input
                          type="text"
                          value={social.url}
                          onChange={(e) =>
                            updateSocialMediaUrl(index, e.target.value)
                          }
                          placeholder={`Your ${social.platform} profile URL`}
                          className={
                            formErrors[`social_media_${index}`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0"
                          onClick={() => removeSocialMedia(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {formData.social_media.some(
                      (_, index) => formErrors[`social_media_${index}`]
                    ) && (
                      <p className="mt-1 text-sm text-red-600">
                        Please enter valid social media URLs
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#AD0000] text-white hover:bg-[#890000]"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// const MarkdownGuide = () => (
//   <div className="text-xs text-gray-500 mt-2 p-2 border rounded bg-gray-50">
//     <h4 className="font-medium mb-1">Markdown Guide:</h4>
//     <ul className="space-y-1">
//       <li>
//         <code>**bold**</code> - <strong>bold</strong>
//       </li>
//       <li>
//         <code>*italic*</code> - <em>italic</em>
//       </li>
//       <li>
//         <code>[Link](https://example.com)</code> - <a href="#">Link</a>
//       </li>
//       <li>
//         <code># Heading 1</code> - Heading
//       </li>
//       <li>
//         <code>- List item</code> - Bullet list
//       </li>
//       <li>
//         <code>1. Numbered item</code> - Numbered list
//       </li>
//     </ul>
//   </div>
// );
