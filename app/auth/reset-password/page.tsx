"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { validatePassword } from "@/lib/validation";
import { useToast } from "@/components/ui/toast-context";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.push("/auth/signin");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const token = searchParams.get("token");

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setFormErrors({ password: passwordError.message });
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setFormErrors({ confirmPassword: "Passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      showToast("Password reset successful! Please sign in with your new password.", "success");
      router.push("/auth/signin");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
  <Suspense>
    <div className="container mx-auto flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <p className="text-sm text-gray-600">
            Enter your new password below.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</p>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your new password"
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
              <p className="text-sm text-gray-500">
                Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm your new password"
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800">
                Sign in here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    </Suspense>
  );
} 