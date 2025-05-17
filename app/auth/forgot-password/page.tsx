"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { validateEmail } from "@/lib/validation";
import { useToast } from "@/components/ui/toast-context";
import { BASE_URL } from "@/lib/utils";

export default function ForgotPassword() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const [message, setMessage] = useState("");

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError.message);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          // Include expiration time for the reset token (24 hours)
          expirationHours: 24,
        }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      setSuccess(
        "If an account exists with this email, you will receive password reset instructions."
      );
      setEmailSent(true);
      showToast("Reset instructions sent to your email", "info");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to send reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <p className="text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="p-3 bg-red-100 text-red-600 rounded-md text-sm mb-4">
              {error}
            </p>
          )}
          {success && (
            <div className="p-3 bg-green-100 text-green-600 rounded-md text-sm mb-4">
              {success}
              <p className="mt-2">
                The reset link will expire in 24 hours for security reasons.
              </p>
            </div>
          )}

          {!emailSent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}

          <div className="text-center text-sm mt-4">
            Remember your password?{" "}
            <Link
              href="/auth/signin"
              className="text-blue-600 hover:text-blue-800"
            >
              Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
