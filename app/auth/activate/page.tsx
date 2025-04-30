"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-context";
import { storeRedirectUrl } from "@/lib/utils";

export default function ActivateAccount() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const activateAccount = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setError("Invalid activation link");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/auth/activate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to activate account");
        }

        showToast("Account activated successfully! You can now sign in.", "success");
        storeRedirectUrl()
        router.push("/auth/signin");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to activate account");
      } finally {
        setLoading(false);
      }
    };

    activateAccount();
  }, [searchParams, router, showToast]);

  return (
    <Suspense>
    <div className="container mx-auto flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#AD0000]">
            Activate Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center">
              <p>Activating your account...</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <p className="text-red-500 text-center">{error}</p>
              <Button
                onClick={() => {
                  storeRedirectUrl();
                  router.push("/auth/signin")
                }}
                className="w-full bg-[#AD0000] hover:bg-[#8B0000]"
              >
                Return to Sign In
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p>Please wait while we activate your account...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </Suspense>
  );
} 