"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { validatePhone, validatePassword } from "@/lib/validation";
import { useToast } from "@/components/ui/toast-context";
import { Eye, EyeOff } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function CompleteRegistration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
    subscriptionPlan: "basic",
    referralCode: "",
    termsAccepted: false,
    privacyAccepted: false,
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.push("/auth/register");
    }
  }, [searchParams, router]);

  const handlePhoneChange = (value: string) => {
    // Ensure the value starts with a '+'
    const formattedValue = value.startsWith("+") ? value : `+${value}`;
    setFormData((prev) => ({ ...prev, phone: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});
    setLoading(true);

    // Validate form fields
    const phoneError = validatePhone(formData.phone);
    const passwordError = validatePassword(formData.password);

    if (phoneError || passwordError) {
      setFormErrors({
        ...(phoneError && { phone: phoneError.message }),
        ...(passwordError && { password: passwordError.message }),
      });
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setFormErrors({ confirmPassword: "Passwords do not match" });
      setLoading(false);
      return;
    }

    // Check if terms and privacy are accepted
    if (!formData.termsAccepted || !formData.privacyAccepted) {
      setError("Please accept the Terms & Conditions and Privacy Policy");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/complete-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: searchParams.get("token"),
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete registration");
      }

      showToast("Registration completed successfully!", "success");
      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to complete registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense>
    <div className="container mx-auto flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Complete Registration</CardTitle>
          <p className="text-sm text-gray-600">
            Please provide additional information to complete your registration.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</p>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput
                country={'ng'}
                value={formData.phone}
                onChange={handlePhoneChange}
                inputClass={`w-full ${formErrors.phone ? "border-red-500" : ""}`}
                containerClass="phone-input"
                buttonClass="phone-input-button"
                dropdownClass="phone-input-dropdown"
                searchClass="phone-input-search"
                placeholder="Enter your phone number"
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm">{formErrors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className={formErrors.password ? "border-red-500" : ""}
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
              {formErrors.password && (
                <p className="text-red-500 text-sm">{formErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className={formErrors.confirmPassword ? "border-red-500" : ""}
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
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscriptionPlan">Subscription Plan</Label>
              <select
                id="subscriptionPlan"
                name="subscriptionPlan"
                className="w-full p-2 border-gray-500 border rounded-md"
                value={formData.subscriptionPlan}
                onChange={(e) => setFormData((prev) => ({ ...prev, subscriptionPlan: e.target.value }))}
              >
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral Code (Optional)</Label>
              <Input
                id="referralCode"
                name="referralCode"
                type="text"
                placeholder="Enter referral code if you have one"
                value={formData.referralCode}
                onChange={(e) => setFormData((prev) => ({ ...prev, referralCode: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, termsAccepted: checked as boolean }))}
                />
                <Label htmlFor="termsAccepted" className="text-sm">
                  I accept the{" "}
                  <a href="/legal/terms" className="text-blue-600 hover:text-blue-800">
                    Terms & Conditions
                  </a>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, privacyAccepted: checked as boolean }))}
                />
                <Label htmlFor="privacyAccepted" className="text-sm">
                  I accept the{" "}
                  <a href="/legal/privacy" className="text-blue-600 hover:text-blue-800">
                    Privacy Policy
                  </a>
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Completing Registration..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </Suspense>
  );
} 