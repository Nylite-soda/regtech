"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast-context";
import { PasswordStrength } from "@/components/ui/password-strength";
import { validateFormField } from "@/lib/validation";
import { Eye, EyeOff, User, Mail, Phone, Lock, Calendar, Building, Globe, Users, MapPin, Briefcase } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { BASE_URL, storeRedirectUrl, isUserSignedIn } from "@/lib/utils";
import { LoadingScreen } from "@/components/ui/loading-screen";

// Define the structure of our form errors
interface FormErrors {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
  phone: string | null;
  termsAccepted: string | null;
  privacyAccepted: string | null;
}

export default function Register() {
  const router = useRouter();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Initialize form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    // subscriptionPlan: "basic",
    referralCode: "",
    termsAccepted: false,
    privacyAccepted: false,
  });
  
  // Initialize form errors with null values
  const [errors, setErrors] = useState<FormErrors>({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    confirmPassword: null,
    phone: null,
    termsAccepted: null,
    privacyAccepted: null,
  });

  // Redirect if user is already signed in
  useEffect(() => {
    const checkAuth = async () => {
      if (isUserSignedIn()) {
        setIsRedirecting(true);
        router.push("/");
      }
    };
    
    checkAuth();
  }, [router]);

  // Store the current URL in localStorage when component mounts
  useEffect(() => {
    // Use the utility function to store the redirect URL
    storeRedirectUrl();
  }, []);

  // Validate a single field and return the error message or null
  const validateField = (name: string, value: string): string | null => {
    return validateFormField(name, value, name === 'confirmPassword' ? formData.password : undefined);
  };

  // Handle input changes and validate in real-time
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    // Update form data
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Validate the field and update errors
    if (name !== "referralCode" && name !== "termsAccepted" && name !== "privacyAccepted") {
      const fieldError = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  };

  // Handle phone input changes
  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
    
    // Validate phone number
    const digitsOnly = value.replace(/\D/g, '');
    const phoneError = digitsOnly.length < 10 ? "Please enter a valid phone number" : null;
    setErrors(prev => ({ ...prev, phone: phoneError }));
  };

  // Validate all fields before form submission
  const validateForm = (): boolean => {
    const newErrors: FormErrors = { ...errors };
    let isValid = true;
    
    // Validate all text fields
    Object.keys(formData).forEach(key => {
      if (key !== "referralCode" && key !== "termsAccepted" && key !== "privacyAccepted") {
        const fieldError = validateField(key, formData[key as keyof typeof formData] as string);
        if (fieldError) {
          newErrors[key as keyof FormErrors] = fieldError;
          isValid = false;
        } else {
          newErrors[key as keyof FormErrors] = null;
        }
      }
    });
    
    // Validate checkboxes
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the Terms and Conditions";
      isValid = false;
    } else {
      newErrors.termsAccepted = null;
    }
    
    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = "You must accept the Privacy Policy";
      isValid = false;
    } else {
      newErrors.privacyAccepted = null;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          phone: formData.phone,
          subscription: "basic",
        }),
      });

      const result = await response.json();

      if (result?.error) {
        setError(result.error);
      } else if (result.status === "success") {
        showToast("Registration successful! Please sign in.", "success");
        router.push("/auth/signin?registered=true");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("An error occurred during Google sign in. Please try again.");
      showToast("Failed to sign in with Google", "error");
    }
  };

  // If user is signed in or redirecting, show a loading state
  if (isRedirecting) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center pb-2">
          <Link href={"/"} className="flex justify-center mb-2">
            <Image src="/images/horizon-logo.png" alt="Logo" width={60} height={60} className="rounded-full" />
          </Link>
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Join our community and start your journey with us
          </CardDescription>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className={`pl-9 ${errors.firstName ? "border-red-500" : ""}`}
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-xs" id="firstName-error">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={`pl-9 ${errors.lastName ? "border-red-500" : ""}`}
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-xs" id="lastName-error">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className={`pl-9 ${errors.email ? "border-red-500" : ""}`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs" id="email-error">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`pl-9 ${errors.password ? "border-red-500" : ""}`}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formData.password && <PasswordStrength password={formData.password} />}
              {errors.password && (
                <p className="text-red-500 text-xs" id="password-error">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`pl-9 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs" id="confirmPassword-error">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <PhoneInput
                country={'ng'}
                value={formData.phone}
                onChange={handlePhoneChange}
                inputClass={`w-full ${errors.phone ? "border-red-500" : ""}`}
                containerClass="phone-input"
                buttonClass="phone-input-button"
                dropdownClass="phone-input-dropdown"
                searchClass="phone-input-search"
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs" id="phone-error">{errors.phone}</p>
              )}
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="subscriptionPlan" className="text-sm font-medium">Subscription Plan</Label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <select
                  id="subscriptionPlan"
                  name="subscriptionPlan"
                  value={formData.subscriptionPlan}
                  onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value })}
                  className="w-full p-2 border rounded-md pl-9 bg-background"
                >
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="referralCode" className="text-sm font-medium">Referral Code (Optional)</Label>
              <Input
                id="referralCode"
                name="referralCode"
                type="text"
                placeholder="Enter referral code"
                value={formData.referralCode}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: checked as boolean })}
                  className="border-muted-foreground"
                  aria-invalid={!!errors.termsAccepted}
                  aria-describedby={errors.termsAccepted ? "terms-error" : undefined}
                />
                <Label htmlFor="termsAccepted" className="text-sm text-muted-foreground">
                  I accept the{" "}
                  <Link href="/terms" className="text-[#AD0000] hover:text-red-600 font-medium">
                    Terms and Conditions
                  </Link>
                </Label>
              </div>
              {errors.termsAccepted && (
                <p className="text-red-500 text-xs" id="terms-error">{errors.termsAccepted}</p>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacyAccepted"
                  name="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onCheckedChange={(checked) => setFormData({ ...formData, privacyAccepted: checked as boolean })}
                  className="border-muted-foreground"
                  aria-invalid={!!errors.privacyAccepted}
                  aria-describedby={errors.privacyAccepted ? "privacy-error" : undefined}
                />
                <Label htmlFor="privacyAccepted" className="text-sm text-muted-foreground">
                  I accept the{" "}
                  <Link href="/privacy" className="text-[#AD0000] hover:text-red-600 font-medium">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.privacyAccepted && (
                <p className="text-red-500 text-xs" id="privacy-error">{errors.privacyAccepted}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#AD0000] hover:bg-[#8B0000] transition-colors mt-4" 
              disabled={loading || Object.values(errors).some(error => error !== null)}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-muted-foreground hover:bg-muted/50"
              onClick={handleGoogleSignIn}
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign up with Google
            </Button>

            <p className="text-sm text-center text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-[#AD0000] hover:text-red-600 font-medium">
                Sign in here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 