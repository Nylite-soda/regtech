"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BASE_URL } from "@/lib/utils";
import { Calendar, MapPin, Users, Building2, Globe, Mail, Phone, Link as LinkIcon, Plus, X, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "@mui/x-date-pickers/icons";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Twitter from "@/components/ui/Twitter";

interface CompanyProfile {
  id: string;
  company_name: string;
  company_email: string;
  company_phone: string;
  company_website: string;
  description: string;
  company_type: string;
  company_size: string;
  year_founded: string;
  headquarters: string;
  founder: string[];
  niche: string;
  last_funding: string;
  services: string;
  logo: string;
  social_media: { platform: string; url: string }[];
  profile_completion: number;
}

export default function CompanyProfile() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    founder: [""],
    niche: "",
    last_funding: "",
    services: "",
    logo: "",
    social_media: [],
    profile_completion: 0
  });

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          showToast("Please log in to access your profile", "error");
          router.push("/auth/company-login");
          return;
        }

        const response = await fetch(`${BASE_URL}/api/v1/company/me`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCompanyId(data.id);
          setFormData(data);
          
          // Set date for year founded if available
          if (data.year_founded) {
            setDate(dayjs(data.year_founded));
          }
        } else {
          showToast("Failed to load company profile", "error");
        }
      } catch (error) {
        console.error("Error fetching company profile:", error);
        showToast("An error occurred while loading your profile", "error");
      }
    };

    fetchCompanyProfile();
  }, [router, showToast]);

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
    const exists = formData.social_media.some(item => item.platform === platform);
    
    if (!exists) {
      setFormData(prev => ({
        ...prev,
        social_media: [...prev.social_media, { platform, url: "" }]
      }));
    }
  };

  const removeSocialMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      social_media: prev.social_media.filter((_, i) => i !== index)
    }));
  };

  const updateSocialMediaUrl = (index: number, url: string) => {
    const updatedSocialMedia = [...formData.social_media];
    updatedSocialMedia[index].url = url;
    
    setFormData(prev => ({
      ...prev,
      social_media: updatedSocialMedia
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Required fields validation
    const requiredFields = [
      "company_name", "company_email", "company_phone", 
      "company_website", "description", "company_type", 
      "company_size", "year_founded", "headquarters", 
      "founder", "niche", "services"
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    // Email validation
    if (formData.company_email && !/\S+@\S+\.\S+/.test(formData.company_email)) {
      errors.company_email = "Please enter a valid email address";
    }
    
    // Website validation
    if (formData.company_website && !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(formData.company_website)) {
      errors.company_website = "Please enter a valid website URL";
    }

    // Founders Validation
    if (!formData.founder.some(name => name.trim())) {
      errors.founder = "At least one founder is required";
    }

    // Social media validation
    formData.social_media.forEach((social, index) => {
      if (social.url && !isValidSocialMediaUrl(social.platform, social.url)) {
        errors[`social_media_${index}`] = `Please enter a valid ${social.platform} URL`;
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidSocialMediaUrl = (platform: string, url: string) => {
    switch(platform) {
      case 'LinkedIn':
        return /^(https?:\/\/)?(www\.)?linkedin\.com\/.*/.test(url);
      case 'Instagram':
        return /^(https?:\/\/)?(www\.)?instagram\.com\/.*/.test(url);
      case 'X':
        return /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.*/.test(url);
      default:
        return true;
    }
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
    if (formData.founder.some(name => name.trim())) completedFields++;
    if (formData.niche) completedFields++;
    if (formData.last_funding) completedFields++;
    if (formData.services) completedFields++;
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
        .map(key => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'))
        .join(', ');
      
      showToast(`Please fill in all required fields: ${errorFields}`, "error");
      return;
    }

    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        showToast("Please log in to update your profile", "error");
        return;
      }

      // Calculate profile completion percentage
      const profileCompletion = calculateProfileCompletion();

      // Make the API request with the bearer token
      const response = await fetch(`${BASE_URL}/api/v1/company/${companyId}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          ...formData,
          profile_completion: profileCompletion
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.message || "Profile update failed");
      }

      showToast("Profile updated successfully!", "success");
      
      // If profile is now 100% complete, redirect to dashboard
      if (profileCompletion === 100) {
        router.push("/dashboard/company");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again later.";
      showToast(errorMessage, "error");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Company Profile</h1>
      
      <form className="space-y-8" onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="details">Company Details</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
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
                className={`mt-1 ${formErrors.company_name ? "border-red-500" : ""}`}
                placeholder="Your Company Ltd."
              />
              {formErrors.company_name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.company_name}</p>
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
                className={`mt-1 ${formErrors.company_email ? "border-red-500" : ""}`}
                placeholder="company@example.com"
              />
              {formErrors.company_email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.company_email}</p>
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
                className={`mt-1 ${formErrors.company_phone ? "border-red-500" : ""}`}
                placeholder="+1 (555) 123-4567"
              />
              {formErrors.company_phone && (
                <p className="mt-1 text-sm text-red-600">{formErrors.company_phone}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="mb-2 mt-2">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={(e) => handleChange(e)}
                className={`mt-1 ${formErrors.description ? "border-red-500" : ""}`}
                placeholder="Briefly describe your company..."
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <Label htmlFor="company_website" className="mb-2 mt-2">Website</Label>
              <Input
                id="company_website"
                name="company_website"
                type="url"
                required
                value={formData.company_website}
                onChange={(e) => handleChange(e)}
                className={`mt-1 ${formErrors.company_website ? "border-red-500" : ""}`}
                placeholder="https://www.yourcompany.com"
              />
              {formErrors.company_website && (
                <p className="mt-1 text-sm text-red-600">{formErrors.company_website}</p>
              )}
            </div>

            {/* Logo Upload */}
            <div>
              <Label htmlFor="logo" className="mb-2 mt-2">Company Logo</Label>
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
                        setFormData(prev => ({
                          ...prev,
                          logo: ""
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
              <Label htmlFor="company_type" className="mb-2 mt-2">Company Type</Label>
              <Select
                value={formData.company_type}
                onValueChange={(value) => handleSelectChange("company_type", value)}
              >
                <SelectTrigger className={`w-full ${formErrors.company_type ? "border-red-500" : ""}`}>
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
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formErrors.company_type && (
                <p className="mt-1 text-sm text-red-600">{formErrors.company_type}</p>
              )}
            </div>
            
            {/* Headquarters */}
            <div>
              <Label htmlFor="headquarters" className="mb-2 mt-2">Headquarters</Label>
              <Input
                id="headquarters"
                name="headquarters"
                type="text"
                required
                value={formData.headquarters}
                onChange={(e) => handleChange(e)}
                className={`mt-1 ${formErrors.headquarters ? "border-red-500" : ""}`}
                placeholder="City, Country"
              />
              {formErrors.headquarters && (
                <p className="mt-1 text-sm text-red-600">{formErrors.headquarters}</p>
              )}
            </div>

            {/* Founder */}
            <div>
              <Label htmlFor="founder" className="mb-1 mt-2">Founder(s)</Label>
              <div className="space-y-2">
                {formData.founder.map((founderName, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      id={`founder-${index}`}
                      name={`founder-${index}`}
                      type="text"
                      value={founderName}
                      onChange={(e) => {
                        const newFounders = [...formData.founder];
                        newFounders[index] = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          founder: newFounders,
                        }));
                        
                        // Add a new empty input when typing in the last input field
                        if (index === formData.founder.length - 1 && e.target.value.trim() !== "") {
                          setFormData((prev) => ({
                            ...prev,
                            founder: [...prev.founder, ""],
                          }));
                        }
                      }}
                      className={`mt-1 ${formErrors.founder ? "border-red-500" : ""}`}
                      placeholder={`Founder ${index + 1}`}
                    />
                    {formData.founder.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={() => {
                          if (formData.founder.length > 1) {
                            const newFounders = [...formData.founder];
                            newFounders.splice(index, 1);
                            setFormData((prev) => ({
                              ...prev,
                              founder: newFounders,
                            }));
                          }
                        }}
                      >
                        <span className="sr-only">Remove</span>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {formErrors.founder && (
                <p className="mt-1 text-sm text-red-600">{formErrors.founder}</p>
              )}
            </div>

            {/* Year Founded */}
            <div>
              <Label htmlFor="year_founded" className="mb-2 mt-2">Year Founded</Label>
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
                    <DemoContainer components={['DateCalendar']}>
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
                                  value: newDate.format("YYYY") 
                                }
                              });
                            }
                          }}
                          views={['year']}
                          openTo="year"
                          sx={{
                            width: '100%',
                            height: 'auto',
                            '& .MuiPickersCalendarHeader-root': {
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              marginTop: '8px',
                            },
                            '& .MuiDayCalendar-header': {
                              paddingLeft: '16px',
                              paddingRight: '16px',
                            },
                            '& .MuiDayCalendar-monthContainer': {
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              paddingBottom: '16px',
                            },
                            '& .MuiPickersDay-root.Mui-selected': {
                              backgroundColor: '#AD0000',
                            },
                            '& .MuiPickersDay-root.Mui-selected:hover': {
                              backgroundColor: '#890000',
                            },
                            '& .MuiPickersDay-root.Mui-selected:focus': {
                              backgroundColor: '#AD0000',
                            },
                            '& .MuiDateCalendar-root .MuiButtonBase-root.MuiPickersDay-root:not(.Mui-selected):hover': {
                              backgroundColor: 'rgba(173, 0, 0, 0.1)',
                            },
                            '& .MuiDateCalendar-root .MuiButtonBase-root.MuiPickersDay-root:focus': {
                              backgroundColor: 'rgba(173, 0, 0, 0.2)',
                            },
                            '& .MuiPickersCalendarHeader-switchViewButton': {
                              color: '#AD0000',
                            },
                            '& .MuiPickersArrowSwitcher-button': {
                              color: '#AD0000',
                            },
                            '& .MuiYearCalendar-root .MuiPickersYear-yearButton.Mui-selected': {
                              backgroundColor: '#AD0000',
                            },
                            '& .MuiYearCalendar-root .MuiPickersYear-yearButton:not(.Mui-selected):hover': {
                              backgroundColor: 'rgba(173, 0, 0, 0.1)',
                            }
                          }}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </PopoverContent>
              </Popover>
              {formErrors.year_founded && (
                <p className="mt-1 text-sm text-red-600">{formErrors.year_founded}</p>
              )}
            </div>
            
            {/* Company Size */}
            <div>
              <Label htmlFor="company_size" className="mb-2 mt-2">Company Size</Label>
              <Select 
                value={formData.company_size}
                onValueChange={(value) => handleSelectChange("company_size", value)}
              >
                <SelectTrigger className={`w-full ${formErrors.company_size ? "border-red-500" : ""}`}>
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
                <p className="mt-1 text-sm text-red-600">{formErrors.company_size}</p>
              )}
            </div>

            {/* Company Niche */}
            <div>
              <Label htmlFor="niche" className="mb-2 mt-2">Company Niche</Label>
              <Select
                value={formData.niche}
                onValueChange={(value) => handleSelectChange("niche", value)}
              >
                <SelectTrigger className={`w-full ${formErrors.niche ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select your niche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="AML">AML</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="KYC">KYC</SelectItem>
                    <SelectItem value="Regulatory">Regulatory</SelectItem>
                    <SelectItem value="Suptech">SupTech</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formErrors.niche && (
                <p className="mt-1 text-sm text-red-600">{formErrors.niche}</p>
              )}
            </div>

            {/* Services */}
            <div>
              <Label htmlFor="services" className="mb-2 mt-2">Services Offered</Label>
              <Textarea
                id="services"
                name="services"
                value={formData.services}
                onChange={(e) => handleChange(e)}
                className={`mt-1 ${formErrors.services ? "border-red-500" : ""}`}
                placeholder="List the services your company offers..."
                required
              />
              {formErrors.services && (
                <p className="mt-1 text-sm text-red-600">{formErrors.services}</p>
              )}
            </div>

            {/* Funding Round */}
            <div>
              <Label htmlFor="last_funding" className="mb-2 mt-2">Last Funding Round</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      !formData.last_funding && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.last_funding ? dayjs(formData.last_funding).format("MMM D, YYYY") : <span>Select funding date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateCalendar']}>
                      <DemoItem>
                        <DateCalendar
                          maxDate={dayjs()}
                          value={formData.last_funding ? dayjs(formData.last_funding) : null}
                          onChange={(newDate) => {
                            if (newDate) {
                              handleChange({
                                target: { 
                                  name: "last_funding", 
                                  value: newDate.format("YYYY-MM-DD") 
                                }
                              });
                            }
                          }}
                          sx={{
                            width: '100%',
                            height: 'auto',
                            '& .MuiPickersCalendarHeader-root': {
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              marginTop: '8px',
                            },
                            '& .MuiDayCalendar-header': {
                              paddingLeft: '16px',
                              paddingRight: '16px',
                            },
                            '& .MuiDayCalendar-monthContainer': {
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              paddingBottom: '16px',
                            },
                            '& .MuiPickersDay-root.Mui-selected': {
                              backgroundColor: '#AD0000',
                            },
                            '& .MuiPickersDay-root.Mui-selected:hover': {
                              backgroundColor: '#890000',
                            },
                            '& .MuiPickersDay-root.Mui-selected:focus': {
                              backgroundColor: '#AD0000',
                            },
                            '& .MuiDateCalendar-root .MuiButtonBase-root.MuiPickersDay-root:not(.Mui-selected):hover': {
                              backgroundColor: 'rgba(173, 0, 0, 0.1)',
                            },
                            '& .MuiDateCalendar-root .MuiButtonBase-root.MuiPickersDay-root:focus': {
                              backgroundColor: 'rgba(173, 0, 0, 0.2)',
                            },
                            '& .MuiPickersCalendarHeader-switchViewButton': {
                              color: '#AD0000',
                            },
                            '& .MuiPickersArrowSwitcher-button': {
                              color: '#AD0000',
                            },
                            '& .MuiYearCalendar-root .MuiPickersYear-yearButton.Mui-selected': {
                              backgroundColor: '#AD0000',
                            },
                            '& .MuiYearCalendar-root .MuiPickersYear-yearButton:not(.Mui-selected):hover': {
                              backgroundColor: 'rgba(173, 0, 0, 0.1)',
                            }
                          }}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </PopoverContent>
              </Popover>
              {formErrors.last_funding && (
                <p className="mt-1 text-sm text-red-600">{formErrors.last_funding}</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4 mt-4">
            {/* Social Media */}
            <div>
              <Label htmlFor="social" className="mb-2 mt-2">Social Media</Label>
              <div className="mt-2 space-y-4">
                {/* Available platforms */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`flex items-center ${
                      formData.social_media.some(s => s.platform === "LinkedIn") 
                        ? "bg-blue-50 text-blue-700" 
                        : ""
                    }`}
                    onClick={() => addSocialMedia("LinkedIn")}
                    disabled={formData.social_media.some(s => s.platform === "LinkedIn")}
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`flex items-center ${
                      formData.social_media.some(s => s.platform === "Instagram") 
                        ? "bg-pink-50 text-pink-700" 
                        : ""
                    }`}
                    onClick={() => addSocialMedia("Instagram")}
                    disabled={formData.social_media.some(s => s.platform === "Instagram")}
                  >
                    <Instagram className="mr-2 h-4 w-4" />
                    Instagram
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`flex items-center ${
                      formData.social_media.some(s => s.platform === "X") 
                        ? "bg-gray-100 text-gray-900" 
                        : ""
                    }`}
                    onClick={() => addSocialMedia("X")}
                    disabled={formData.social_media.some(s => s.platform === "X")}
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    X
                  </Button>
                </div>

                {/* Added social media inputs */}
                {formData.social_media.length > 0 && (
                  <div className="space-y-2 rounded-md border border-gray-200 p-3">
                    {formData.social_media.map((social, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex w-24 flex-shrink-0 items-center">
                          {social.platform === "LinkedIn" && <Linkedin className="mr-2 h-4 w-4" />}
                          {social.platform === "Instagram" && <Instagram className="mr-2 h-4 w-4" />}
                          {social.platform === "X" && <Twitter className="mr-2 h-4 w-4" />}
                          <span className="text-sm">{social.platform}:</span>
                        </div>
                        <Input
                          type="url"
                          value={social.url}
                          onChange={(e) => updateSocialMediaUrl(index, e.target.value)}
                          placeholder={`Your ${social.platform} profile URL`}
                          className={formErrors[`social_media_${index}`] ? "border-red-500" : ""}
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
                    {formData.social_media.some((_, index) => formErrors[`social_media_${index}`]) && (
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