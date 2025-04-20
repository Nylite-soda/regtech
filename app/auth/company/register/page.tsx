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
import { BASE_URL, storeRedirectUrl } from "@/lib/utils";
import CountrySelect from "react-select-country-list";

// Define the Country type
interface Country {
  value: string;
  label: string;
}

// Preload country data
const countryData = CountrySelect().getData();

export default function CompanyRegister() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [yearPopoverOpen, setYearPopoverOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [countryOptions, setCountryOptions] = useState<Country[]>(countryData);
  
  const [formData, setFormData] = useState({
    companyName: "",  
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    type: "",
    website: "",
    size: "",
    yearFounded: "",
    headquarters: "",
    country: "",
    niche: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "",
  });

  // Initialize country options
    useEffect(() => {
    setCountryOptions(CountrySelect().getData());
    }, []);

  // Store the current URL in localStorage when component mounts
  useEffect(() => {
    // Use the utility function to store the redirect URL
    storeRedirectUrl();
  }, []);

  // Add useEffect for real-time validation
  useEffect(() => {
    const errors: Record<string, string> = {};

    // Password validation
    if (formData.password) {
      if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      } else if (!/[A-Z]/.test(formData.password)) {
        errors.password = "Password must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(formData.password)) {
        errors.password = "Password must contain at least one lowercase letter";
      } else if (!/[0-9]/.test(formData.password)) {
        errors.password = "Password must contain at least one number";
      } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
        errors.password = "Password must contain at least one special character";
      }
    }

    // Confirm password validation
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
  }, [formData.password, formData.confirmPassword]);

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    let message = "";
    let color = "";

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character type checks
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Set message and color based on score
    switch (score) {
      case 0:
      case 1:
        message = "Very Weak";
        color = "text-red-500";
        break;
      case 2:
      case 3:
        message = "Weak";
        color = "text-orange-500";
        break;
      case 4:
      case 5:
        message = "Medium";
        color = "text-yellow-500";
        break;
      case 6:
        message = "Strong";
        color = "text-green-500";
        break;
    }

    return { score, message, color };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
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

  // const addSocialMedia = (platform: string) => {
  //   // Check if this platform already exists
  //   const exists = formData.social_media.some(item => item.platform === platform);
    
  //   if (!exists) {
  //     setFormData(prev => ({
  //       ...prev,
  //       social_media: [...prev.social_media, { platform, url: "" }]
  //     }));
  //   }
  // };

  // const removeSocialMedia = (index: number) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     social_media: prev.social_media.filter((_, i) => i !== index)
  //   }));
  // };

  // const updateSocialMediaUrl = (index: number, url: string) => {
  //   const updatedSocialMedia = [...formData.social_media];
  //   updatedSocialMedia[index].url = url;
    
  //   setFormData(prev => ({
  //     ...prev,
  //     social_media: updatedSocialMedia
  //   }));
  // };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Required fields validation
    const requiredFields = [
      "companyName", "email", "phone", "password", "confirmPassword", 
      "type", "website", "size", "yearFounded", "headquarters", "country", "niche"
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    // Email validation with proper format check
    if (formData.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address (e.g., user@example.com)";
      }
    }
    
    // Password validation
    if (formData.password) {
      if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(formData.password)) {
        errors.password = "Password must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(formData.password)) {
        errors.password = "Password must contain at least one lowercase letter";
      } else if (!/[0-9]/.test(formData.password)) {
        errors.password = "Password must contain at least one number";
      } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
        errors.password = "Password must contain at least one special character";
      }
    }
    
    // Password match validation
    if (formData.password && formData.confirmPassword && 
        formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Website validation
    if (formData.website && !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(formData.website)) {
      errors.website = "Please enter a valid website URL";
    }

    // Year founded validation - ensure it's a valid number
    if (formData.yearFounded) {
      const year = parseInt(formData.yearFounded, 10);
      const currentYear = new Date().getFullYear();
      
      if (isNaN(year)) {
        errors.yearFounded = "Year founded must be a valid number";
      } else if (year < 1800 || year > currentYear) {
        errors.yearFounded = `Year founded must be between 1800 and ${currentYear}`;
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!validateForm()) {
      setLoading(false);
      const errorFields = Object.keys(formErrors)
        .map(key => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'))
        .join(', ');
      
      showToast(`Please fill in all required fields: ${errorFields}`, "error");
      return;
    }

    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        showToast("User not signed up", "error");
        router.push("/auth/signin");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/v1/company/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            company_type: formData.type,
            company_name: formData.companyName,
            company_email: formData.email,
            company_phone: formData.phone,
            company_website: formData.website,
            company_size: formData.size,
          year_founded: parseInt(formData.yearFounded, 10), // Convert to number
            headquarters: formData.headquarters,
          country: formData.country,
            niche: formData.niche,
            company_password: formData.password,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // console.log(result.detail);
        if (result.detail === "Failed to create company: 400: Company with this email already exists") {
          result.error = "Company with this email already exists"
        }
        throw new Error(result.error || result.message || "Registration failed");
      }

      if (result.status === "success") {
        showToast("Registration successful! Please log in.", "success");
        router.push("/auth/company-login?registered=true");
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
          <div className="space-y-4">
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
                  onChange={handlePasswordChange}
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
              {formData.password && (
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          passwordStrength.score <= 2 ? 'bg-red-500' :
                          passwordStrength.score <= 4 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm ${passwordStrength.color}`}>
                      {passwordStrength.message}
                    </span>
                  </div>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li className={formData.password.length >= 8 ? "text-green-500" : ""}>
                      • At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? "text-green-500" : ""}>
                      • One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(formData.password) ? "text-green-500" : ""}>
                      • One lowercase letter
                    </li>
                    <li className={/[0-9]/.test(formData.password) ? "text-green-500" : ""}>
                      • One number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(formData.password) ? "text-green-500" : ""}>
                      • One special character
                    </li>
                  </ul>
                </div>
              )}
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
                  onChange={handlePasswordChange}
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
              {formData.confirmPassword && !formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-green-600">Passwords match</p>
              )}
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )}
              </div>
            
              {/* Company Type */}
              <div>
              <Label htmlFor="type">Company Type</Label>
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

              {/* Website */}
              <div>
              <Label htmlFor="website">Website</Label>
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

            {/* Company Size */}
              <div>
              <Label htmlFor="size">Company Size</Label>
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

              {/* Year Founded */}
              <div>
              <Label htmlFor="yearFounded">Year Founded</Label>
              <Popover open={yearPopoverOpen} onOpenChange={setYearPopoverOpen}>
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
                              // Close the popover after selection
                              setYearPopoverOpen(false);
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
              
            {/* Headquarters */}
              <div>
              <Label htmlFor="headquarters">Headquarters</Label>
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

            {/* Country */}
            <div>
              <Label htmlFor="country">Country</Label>
                <Select 
                value={formData.country}
                onValueChange={(value) => handleSelectChange("country", value)}
                >
                <SelectTrigger className={`w-full ${formErrors.country ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                    <SelectGroup>
                    {countryOptions.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              {formErrors.country && (
                <p className="mt-1 text-sm text-red-600">{formErrors.country}</p>
                )}
              </div>

              {/* Company Niche */}
              <div>
              <Label htmlFor="niche">Company Niche</Label>
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
              </div>

          <Button
            type="submit"
            className="mt-8 w-full dark:bg-[#AD0000] dark:text-white dark:hover:bg-[#890000] dark:hover:text-white hover:cursor-pointer"
            disabled={loading}
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