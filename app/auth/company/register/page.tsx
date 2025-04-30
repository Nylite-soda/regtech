"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/toast-context";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "@mui/x-date-pickers/icons";
import { BASE_URL, isUserSignedIn, storeRedirectUrl } from "@/lib/utils";
import CountrySelect from "react-select-country-list";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { validateEmail, validatePassword, validatePhone, validateConfirmPassword, validateWebsite } from "@/lib/validation";

// Define the Country type
interface Country {
  value: string;
  label: string;
}

// Define form data interface
interface FormData {
  companyName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  type: string;
  website: string;
  size: string;
  yearFounded: string;
  headquarters: string;
  country: string;
  niche: string;
}

// Define form field props interface
interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  touched:boolean
}

// Preload country data
const countryData = CountrySelect().getData();

// Constants
const COMPANY_TYPES = [
  { value: "Startup", label: "Startup" },
  { value: "SME", label: "SME" },
  { value: "Enterprise", label: "Enterprise" },
  { value: "Public", label: "Public Company" },
  { value: "NGO", label: "NGO/Non-profit" },
  { value: "Government", label: "Government" }
];

const COMPANY_SIZES = [
  { value: "1-10", label: "1 to 10" },
  { value: "11-50", label: "11 to 50" },
  { value: "51-200", label: "51 to 200" },
  { value: "201-500", label: "201 to 500" },
  { value: "501-1000", label: "501 to 1000" },
  { value: "1000+", label: "Over 1000" }
];

const COMPANY_NICHES = [
  { value: "AML", label: "AML" },
  { value: "Compliance", label: "Compliance" },
  { value: "KYC", label: "KYC" },
  { value: "Regulatory", label: "Regulatory" },
  { value: "Suptech", label: "SupTech" }
];

const INITIAL_FORM_STATE: FormData = {
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
};

// Password validation criteria - using from the validations.ts file
const PASSWORD_CRITERIA = [
  { check: (pwd: string) => pwd.length >= 8, label: "At least 8 characters" },
  { check: (pwd: string) => /[A-Z]/.test(pwd), label: "One uppercase letter" },
  { check: (pwd: string) => /[a-z]/.test(pwd), label: "One lowercase letter" },
  { check: (pwd: string) => /[0-9]/.test(pwd), label: "One number" },
  { check: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), label: "One special character" }
];

const PASSWORD_STRENGTH_MESSAGES = [
  { score: 0, message: "Very Weak", color: "text-red-500" },
  { score: 1, message: "Weak", color: "text-orange-500" },
  { score: 2, message: "Medium", color: "text-yellow-500" },
  { score: 3, message: "Strong", color: "text-green-500" }
];

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
  const [countryOptions, setCountryOptions] = useState<Country[]>(countryData);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "",
  });

  useEffect(() => {
    setCountryOptions(CountrySelect().getData());
    
    const checkAuth = async () => {
      if (!isUserSignedIn()) {
        setIsRedirecting(true);
        storeRedirectUrl()
        router.push("/auth/signin");
      }
    };
    
    checkAuth();
  }, [router]);

  // Calculate password strength based on validation criteria
  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    
    // Count passed criteria
    PASSWORD_CRITERIA.forEach(criterion => {
      if (criterion.check(password)) score++;
    });
    
    // Additional points for length
    if (password.length >= 12) score++;
    
    // Set message and color based on score
    let message, color;
    if (score <= 2) {
      message = "Very Weak";
      color = "text-red-500";
    } else if (score <= 4) {
      message = "Weak";
      color = "text-orange-500";
    } else if (score === 5) {
      message = "Medium";
      color = "text-yellow-500";
    } else {
      message = "Strong";
      color = "text-green-500";
    }
    
    return { score, message, color };
  };

  // Handle password input changes
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    
    if (e.target.name === "password") {
      setPasswordStrength(calculatePasswordStrength(e.target.value));
    }
  };

  // Generic handler for input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle select field changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouchedFields(prev => ({ ...prev, [name]: true })); // Mark as touched
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form using imported validation functions
  const validate = () => {
    const errors: Record<string, string> = {};
    const currentYear = new Date().getFullYear();

    // Required fields validation
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) {
      errors.email = emailError.message;
    }

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      errors.password = passwordError.message;
    }

    // Confirm password validation
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
    if (confirmPasswordError) {
      errors.confirmPassword = confirmPasswordError.message;
    }

    // Phone validation
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      errors.phone = phoneError.message;
    }

    // Company name validation
    if (formData.companyName && formData.companyName.length < 3) {
      errors.companyName = "Company name must be at least 3 characters";
    }
    
    // Website validation (if provided)
    if (formData.website) {
      const websiteError = validateWebsite(formData.website);
      if (websiteError) {
        errors.website = websiteError.message;
      }
    }
    
    // Year founded validation
    if (formData.yearFounded) {
      const year = parseInt(formData.yearFounded, 10);
      if (isNaN(year) || year < 1800 || year > currentYear) {
        errors.yearFounded = `Year founded must be between 1800 and ${currentYear}`;
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Trigger validation on form changes
  useEffect(() => {
    const handler = setTimeout(() => {
      validate();
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [formData]);

  // Form submission handler
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    // Mark all fields as touched on submit
    const allFields = Object.keys(formData);
    const newTouched = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouchedFields(newTouched);
  
    if (!validate()) {
      setLoading(false);
      const errorFields = Object.keys(formErrors)
        .map(key => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'))
        .join(', ');
      
      showToast(`Please address the following issues: ${errorFields}`, "error");
      return;
    }

    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        showToast("Authentication required", "error");
        storeRedirectUrl()
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
          year_founded: parseInt(formData.yearFounded, 10),
          headquarters: formData.headquarters,
          country: formData.country,
          niche: formData.niche,
          company_password: formData.password,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        const errorMessage = result.detail === "Failed to create company: 400: Company with this email already exists" 
          ? "Company with this email already exists"
          : result.error || result.message || "Registration failed";
        throw new Error(errorMessage);
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

  if (isRedirecting) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        {/* Header */}
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

        {/* Error display */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Registration form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Company Name */}
            <FormField
              label="Company Name"
              name="companyName"
              type="text"
              placeholder="Your Company Ltd."
              value={formData.companyName}
              onChange={handleChange}
              error={formErrors.companyName}
              touched={touchedFields.companyName}
            />

            {/* Email Address */}
            <FormField
              label="Email address"
              name="email"
              type="email"
              placeholder="company@example.com"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              touched={touchedFields.email}
            />

            {/* Phone Number */}
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
              error={formErrors.phone}
              touched={touchedFields.phone}
            />

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
                  className={`mt-1 pr-10 ${formErrors.password && touchedFields.password ? "border-red-500" : ""}`}
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
              
              {/* Password strength indicator */}
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
                  
                  {/* Password criteria checklist */}
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    {PASSWORD_CRITERIA.map((criterion, index) => (
                      <li key={index} className={criterion.check(formData.password) ? "text-green-500" : ""}>
                        • {criterion.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {formErrors.password && touchedFields.password && (
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
                  className={`mt-1 pr-10 ${formErrors.confirmPassword && touchedFields.confirmPassword ? "border-red-500" : ""}`}
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
              
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="mt-1 text-sm text-green-600">Passwords match</p>
              )}
              
              {formErrors.confirmPassword && touchedFields.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
              )}

              {formErrors.password && touchedFields.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>
          
            {/* Company Type */}
            <div>
              <Label htmlFor="type" className="mb-2">Company Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className={`w-full ${formErrors.type && touchedFields.type ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select company type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {COMPANY_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formErrors.type && touchedFields.type && (
                <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
              )}
            </div>

            {/* Website */}
            <FormField
              label="Website"
              name="website"
              type="url"
              placeholder="https://www.yourcompany.com"
              value={formData.website}
              onChange={handleChange}
              error={formErrors.website}
              touched={touchedFields.website}
            />

            {/* Company Size */}
            <div>
              <Label htmlFor="size" className="mb-2">Company Size</Label>
              <Select 
                value={formData.size}
                onValueChange={(value) => handleSelectChange("size", value)}
              >
                <SelectTrigger className={`w-full ${formErrors.size && touchedFields.size ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {COMPANY_SIZES.map(size => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formErrors.size && touchedFields.size && (
                <p className="mt-1 text-sm text-red-600">{formErrors.size}</p>
              )}
            </div>

            {/* Year Founded */}
            <div>
              <Label htmlFor="yearFounded" className="mb-2">Year Founded</Label>
              <Popover open={yearPopoverOpen} onOpenChange={setYearPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !formData.yearFounded && "text-muted-foreground"
                    } ${formErrors.yearFounded && touchedFields.yearFounded ? "border-red-500" : ""}`}
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
                              const e = {
                                target: {
                                  name: "yearFounded",
                                  value: newDate.format("YYYY")
                                }
                              } as ChangeEvent<HTMLInputElement>;
                              handleChange(e);
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
                            '& .MuiPickersDay-root.Mui-selected': {
                              backgroundColor: '#AD0000',
                            },
                            '& .MuiPickersDay-root.Mui-selected:hover': {
                              backgroundColor: '#890000',
                            },
                            '& .MuiPickersDay-root.Mui-selected:focus': {
                              backgroundColor: '#AD0000',
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
              {formErrors.yearFounded && touchedFields.yearFounded && (
                <p className="mt-1 text-sm text-red-600">{formErrors.yearFounded}</p>
              )}
            </div>
            
            {/* Headquarters */}
            <FormField
              label="Headquarters"
              name="headquarters"
              type="text"
              placeholder="Enter your HQ address..."
              value={formData.headquarters}
              onChange={handleChange}
              error={formErrors.headquarters}
              touched={touchedFields.headquarters}
            />

            {/* Country */}
            <div>
              <Label htmlFor="country" className="mb-2">Country</Label>
              <Select 
                value={formData.country}
                onValueChange={(value) => handleSelectChange("country", value)}
              >
                <SelectTrigger className={`w-full ${formErrors.country&& touchedFields.country ? "border-red-500" : ""}`}>
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
              {formErrors.country && touchedFields.country && (
                <p className="mt-1 text-sm text-red-600">{formErrors.country}</p>
              )}
            </div>

            {/* Company Niche */}
            <div>
              <Label htmlFor="niche" className="mb-2">Company Niche</Label>
              <Select
                value={formData.niche}
                onValueChange={(value) => handleSelectChange("niche", value)}
              >
                <SelectTrigger className={`w-full ${formErrors.niche && touchedFields.niche ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select your niche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {COMPANY_NICHES.map(niche => (
                      <SelectItem key={niche.value} value={niche.value}>
                        {niche.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formErrors.niche && touchedFields.niche && (
                <p className="mt-1 text-sm text-red-600">{formErrors.niche}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="mt-8 w-full dark:bg-[#AD0000] dark:text-white dark:hover:bg-[#890000] dark:hover:text-white hover:cursor-pointer"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Company"}
          </Button>
        </form>

        {/* Sign-in link */}
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

// Reusable form field component
function FormField({ label, name, type, placeholder, value, onChange, error, touched }: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        className={`mt-1 ${error && touched ? "border-red-500" : ""}`}
        placeholder={placeholder}
      />
      {error && touched && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}