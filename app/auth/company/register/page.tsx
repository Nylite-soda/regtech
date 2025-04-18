"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Plus, X, Linkedin, Instagram, Twitter } from "lucide-react";
import { useToast } from "@/components/ui/toast-context";
import { Textarea } from "@/components/ui/textarea";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "@mui/x-date-pickers/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BASE_URL } from "@/lib/utils";

export default function CompanyRegister() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [date, setDate] = useState<Dayjs | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    companyName: "",  
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    description: "",
    yearFounded: "",
    size: "",
    niche: "",
    lastFunding: "",
    services: "",
    founder: [""],
    type: "",
    website: "",
    headquarters: "",
    logo: "",
    social_media: [] as {platform: string, url: string}[],
  });

    useEffect(() => {
      const storedData = localStorage.getItem("access_token")
      if (!storedData) {
        showToast("User not signed up", "error");
        router.push("/auth/signin");
        return;
      }
    }, []);

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
      "companyName", "email", "phone", "password", "confirmPassword", 
      "description", "yearFounded", "size", "niche", "founder", "type", "website", "headquarters"
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (formData.password && formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    
    // Password match validation
    if (formData.password && formData.confirmPassword && 
        formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Founders Validation
    if (!formData.founder.some(name => name.trim())) {
      errors.founder = "At least one founder is required";
    }

    // Website validation
    if (formData.website && !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(formData.website)) {
      errors.website = "Please enter a valid website URL";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // if (!validateForm()) {
    //   setLoading(false);

    //   const errorFields = Object.keys(formErrors)
    //   .map(key => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'))
    //   .join(', ');
      
    //   showToast(`Please fill in all required fields: ${errorFields}`, "error");
    //   return;
    // }
    
    // const dataToSubmit = {
    //   ...formData,
    //   founder: formData.founder.filter(name => name.trim()),
    // };

    try {
      // Get the access token from localStorage
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        showToast("User not signed up", "error");
        return;
      }

      // Make the API request with the bearer token
      const response = await fetch(`${BASE_URL}/api/v1/company/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(
          {
            company_type: formData.type,
            company_name: formData.companyName,
            company_email: formData.email,
            company_phone: formData.phone,
            company_website: formData.website,
            company_size: formData.size,
            year_founded: formData.yearFounded,
            headquarters: formData.headquarters,
            description: formData.description,
            social_media: formData.social_media,
            founder: formData.founder,
            niche: formData.niche,
            last_funding: formData.lastFunding,
            logo: formData.logo,
            company_password: formData.password,
            founders: formData.founder
          }
        ),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.message || "Registration failed");
      }

      if (result.status === "success") {
        showToast("Registration successful! Please log in.", "success");
        router.push("/auth/company-login?registered=true");
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again later.";
      setError(errorMessage);
      showToast(errorMessage, "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <div className="flex flex-col items-center justify-center">
          <Link href="/" className="mb-6">
            <Image
              src="/images/horizon-logo.png"
              alt="Regtech Horizon"
              width={80}
              height={80}
              className="h-auto w-auto"
            />
          </Link>
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Register Your Company
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create a company account on our platform
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account Information</TabsTrigger>
              <TabsTrigger value="company">Company Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="space-y-4 mt-4">
              {/* Company Name */}
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => handleChange(e)}
                  className={`mt-1 ${formErrors.companyName ? "border-red-500" : ""}`}
                  placeholder="Your Company Ltd."
                />
                {formErrors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.companyName}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange(e)}
                  className={`mt-1 ${formErrors.email ? "border-red-500" : ""}`}
                  placeholder="company@example.com"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange(e)}
                  className={`mt-1 ${formErrors.phone ? "border-red-500" : ""}`}
                  placeholder="+1 (555) 123-4567"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => handleChange(e)}
                    className={`mt-1 pr-10 ${formErrors.password ? "border-red-500" : ""}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>
              
              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange(e)}
                    className={`mt-1 pr-10 ${formErrors.confirmPassword ? "border-red-500" : ""}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="company" className="space-y-4 mt-4">
              {/* Company Type */}
              <div>
                <Label htmlFor="type"  className="mb-2 mt-2">Company Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className={`w-full ${formErrors.type ? "border-red-500" : ""}`}>
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
                {formErrors.type && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
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
                <Label htmlFor="website" className="mb-2 mt-2">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  required
                  value={formData.website}
                  onChange={(e) => handleChange(e)}
                  className={`mt-1 ${formErrors.website ? "border-red-500" : ""}`}
                  placeholder="https://www.yourcompany.com"
                />
                {formErrors.website && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.website}</p>
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
                <Label htmlFor="yearFounded"  className="mb-2 mt-2">Year Founded</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        !formData.yearFounded && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.yearFounded || <span>Select year</span>}
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
                                    name: "yearFounded", 
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
                {formErrors.yearFounded && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.yearFounded}</p>
                )}
              </div>
              
              {/* Company Size */}
              <div>
                <Label htmlFor="size" className="mb-2 mt-2">Company Size</Label>
                <Select 
                  value={formData.size}
                  onValueChange={(value) => handleSelectChange("size", value)}
                >
                  <SelectTrigger className={`w-full ${formErrors.size ? "border-red-500" : ""}`}>
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
                {formErrors.size && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.size}</p>
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
                <Label htmlFor="lastFunding" className="mb-2 mt-2">Last Funding Round</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        !formData.lastFunding && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.lastFunding ? dayjs(formData.lastFunding).format("MMM D, YYYY") : <span>Select funding date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DateCalendar']}>
                        <DemoItem>
                          <DateCalendar
                            maxDate={dayjs()}
                            value={formData.lastFunding ? dayjs(formData.lastFunding) : null}
                            onChange={(newDate) => {
                              if (newDate) {
                                handleChange({
                                  target: { 
                                    name: "lastFunding", 
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
                {formErrors.lastFunding && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.lastFunding}</p>
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
                      X (Twitter)
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

          <Button
            type="submit"
            className="mt-8 w-full dark:bg-[#AD0000] dark:text-white dark:hover:bg-[#890000] dark:hover:text-white hover:cursor-pointer"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Registering..." : "Register Company"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have a company account?{" "}
            <Link
              href="/auth/company-login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}