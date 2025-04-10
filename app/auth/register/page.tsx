"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-context";
import { PasswordStrength } from "@/components/ui/password-strength";
import { validateEmail, validatePassword, validateName, validatePhone } from "@/lib/validation";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Register() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    subscriptionPlan: "basic",
    referralCode: "",
    termsAccepted: false,
    privacyAccepted: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Real-time validation
  useEffect(() => {
    const validationErrors: Record<string, string> = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) validationErrors[emailError.field] = emailError.message;

    const firstNameError = validateName(formData.firstName);
    if (firstNameError) validationErrors[firstNameError.field] = firstNameError.message;

    const lastNameError = validateName(formData.lastName);
    if (lastNameError) validationErrors[lastNameError.field] = lastNameError.message;

    if (formData.phone) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) validationErrors[phoneError.field] = phoneError.message;
    }

    // Add password confirmation validation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      phone: value.startsWith('+') ? value : `+${value}`
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    console.log(formData.phone)

    // Validate all fields
    const validationErrors: Record<string, string> = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) validationErrors[emailError.field] = emailError.message;

    const passwordError = validatePassword(formData.password);
    if (passwordError) validationErrors[passwordError.field] = passwordError.message;

    const firstNameError = validateName(formData.firstName);
    if (firstNameError) validationErrors[firstNameError.field] = firstNameError.message;

    const lastNameError = validateName(formData.lastName);
    if (lastNameError) validationErrors[lastNameError.field] = lastNameError.message;

    if (formData.phone) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) validationErrors[phoneError.field] = phoneError.message;
    }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.termsAccepted) {
      validationErrors.termsAccepted = "You must accept the Terms & Conditions";
    }

    if (!formData.privacyAccepted) {
      validationErrors.privacyAccepted = "You must accept the Privacy Policy";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      showToast("An unexpected errror occurred. Please Try again!", "error");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          subscription: formData.subscriptionPlan,
          phone_number: formData.phone || null,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          first_name: formData.firstName,
          last_name: formData.lastName,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to register");
      }
  
      // Save token (optional: for login persistence)
      localStorage.setItem("access_token", result.data.access_token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      showToast("Registration successful!", "success");
      router.push("/auth/signin?registered=true");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to register", "error");
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

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-black">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  className={`${errors.firstName ? "border-red-500" : ""}`}
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="text-[#AD0000] text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2 text-black">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  className={`${errors.lastName ? "border-red-500" : ""}`}
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="text-[#AD0000] text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2 text-black">
              <Label htmlFor="email">Email</Label>
              <Input
                className={`${errors.email ? "border-red-500" : ""}`}
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-[#AD0000] text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2 text-black">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  className={`${errors.password ? "border-red-500" : ""}`}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <PasswordStrength password={formData.password} />
              {errors.password && (
                <p className="text-[#AD0000] text-sm">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2 text-black">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  className={`${errors.confirmPassword ? "border-red-500" : ""}`}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[#AD0000] text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2 text-black">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
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
                <p className="text-[#AD0000] text-sm">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2 text-black">
              <Label htmlFor="subscriptionPlan">Subscription Plan</Label>
              <Select
                value={formData.subscriptionPlan}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subscriptionPlan: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 text-black">
              <Label htmlFor="referralCode">Referral Code (Optional)</Label>
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
                  onCheckedChange={(checked: boolean) => 
                    setFormData(prev => ({ ...prev, termsAccepted: checked }))
                  }
                />
                <Label htmlFor="termsAccepted" className="text-sm">
                  I accept the{" "}
                  <Link href="/terms" className="text-[#AD0000] hover:underline">
                    Terms & Conditions
                  </Link>
                </Label>
              </div>
              {errors.termsAccepted && (
                <p className="text-[#AD0000] text-sm">{errors.termsAccepted}</p>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacyAccepted"
                  name="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onCheckedChange={(checked: boolean) => 
                    setFormData(prev => ({ ...prev, privacyAccepted: checked }))
                  }
                />
                <Label htmlFor="privacyAccepted" className="text-sm">
                  I accept the{" "}
                  <Link href="/privacy" className="text-[#AD0000] hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.privacyAccepted && (
                <p className="text-[#AD0000] text-sm">{errors.privacyAccepted}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#AD0000] hover:bg-[#8B0000] mt-3" 
              disabled={loading || Object.keys(errors).length > 0}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="relative">
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
              className="w-full"
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

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-[#AD0000] hover:text-red-600">
                Sign in here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 