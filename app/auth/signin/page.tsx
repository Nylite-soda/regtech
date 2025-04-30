"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { validateEmail, validatePassword } from "@/lib/validation";
import { useToast } from "@/components/ui/toast-context";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { BASE_URL, getAndClearRedirectUrl, isUserSignedIn } from "@/lib/utils";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if user is already signed in
  useEffect(() => {
    if (isUserSignedIn()) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Registration successful! Please sign in with your credentials.");
    }
  }, [searchParams]);

  // Real-time validation
  useEffect(() => {
    const errors: Record<string, string> = {};
    
    // Email validation
    if (formData.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        errors.email = emailError.message;
      }
    }
    
    // Password validation - for sign in we only check if it's not empty
    if (formData.password) {
      if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      }
    }
    
    setFormErrors(errors);
  }, [formData.email, formData.password]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Required field validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        errors.email = emailError.message;
      }
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const result = await response.json();
  
      if (result?.detail) {
        if (result.detail === "Invalid user credentials") {
          setError("Invalid user credentials!");
        } else {
          setError(result.detail || "An unexpected error occured! Try again later.");
        }
      } else if (result.status === "success") {
        localStorage.setItem("access_token", result.data.access_token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        showToast(result.message || "Welcome back!", "success");
        
        // Use the utility function to get and clear the redirect URL
        const redirectUrl = getAndClearRedirectUrl();
        router.push(redirectUrl);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Get the redirect URL before signing in with Google
      const redirectUrl = getAndClearRedirectUrl();
      await signIn("google", { callbackUrl: redirectUrl });
    } catch (error) {
      setError("An error occurred during Google sign in. Please try again.");
    }
  };

  // If user is signed in, don't render the sign-in form
  if (isUserSignedIn()) {
    return null; // Return null while redirecting
  }

  return (
    <Suspense>
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-6 sm:py-12 px-4">
        <Link href="/" className="mb-2 hover:opacity-80 transition-opacity">
          <Image src="/images/horizon-logo.png" alt="Logo" width={80} height={80} className="rounded-full" />
        </Link>
        
        <Card className="w-full max-w-md shadow-lg mx-4">
          <CardHeader className="space-y-3 px-4 sm:px-6">
            <div className="text-center">
              <CardTitle className="text-xl sm:text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Sign in to your account to continue
              </CardDescription>
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className={`${formErrors.email ? "border-red-500" : ""} h-10 sm:h-11 text-base`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs sm:text-sm">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    className={`${formErrors.password ? "border-red-500" : ""} h-10 sm:h-11 pr-10 text-base`}
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
                  <p className="text-red-500 text-xs sm:text-sm">{formErrors.password}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-muted-foreground">Remember me</Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#AD0000] hover:text-red-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-10 sm:h-11 bg-[#AD0000] hover:bg-red-700 transition-colors text-base" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="relative my-4 sm:my-6">
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
                className="w-full h-10 sm:h-11 border-2 hover:bg-gray-50 transition-colors text-base"
                onClick={handleGoogleSignIn}
              >
                <Image
                  src="/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Sign in with Google
              </Button>

              <p className="text-sm text-center text-muted-foreground mt-4 sm:mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-[#AD0000] hover:text-red-600 transition-colors font-medium">
                  Register here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
} 