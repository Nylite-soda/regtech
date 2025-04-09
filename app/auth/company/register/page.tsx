"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
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

export default function CompanyRegister() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [date, setDate] = useState<Dayjs | null>(null);
  
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
  });

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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Required fields validation
    const requiredFields = [
      "companyName", "email", "phone", "password", "confirmPassword", 
      "description", "yearFounded", "size", "niche", "founder"
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
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    const dataToSubmit = {
      ...formData,
      founder: formData.founder.filter(name => name.trim()),
    };

    try {
      // This is a placeholder for the actual API call
      // Replace with your actual API integration
      const response = await fetch("/api/company/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });
      
      const result = await response.json();
      
      if (result.status === "error") {
        setError(result.message || "Registration failed. Please try again.");
      } else if (result.status === "success") {
        showToast("Registration successful! Please log in.", "success");
        router.push("/auth/company-login?registered=true");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
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
          </div>

          <div className="flex flex-col items-center justify-center mt-15">
            <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
              Company Data
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Tell us about your company
            </p>
          </div>
          
          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
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

          {/* Founder */}
          <div>
            <Label htmlFor="founder">Founder(s)</Label>
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
            <Label htmlFor="yearFounded" className="mb-2">Year Founded</Label>
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

          {/* Services */}
          <div>
            <Label htmlFor="services">Services Offered</Label>
            <Textarea
              id="services"
              name="services"
              value={formData.services}
              onChange={(e) => handleChange(e)}
              className={`mt-1 ${formErrors.services ? "border-red-500" : ""}`}
              placeholder="List the services your company offers..."
            />
            {formErrors.services && (
              <p className="mt-1 text-sm text-red-600">{formErrors.services}</p>
            )}
          </div>

          {/* Funding Round */}
          <div>
            <Label htmlFor="lastFunding" className="mb-2">Last Funding Round</Label>
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

          <Button
            type="submit"
            className="w-full"
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