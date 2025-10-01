"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth";

function RefreshContent() {
  const [status, setStatus] = useState("Refreshing your session...");
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const currentUser = auth?.currentUser;

  useEffect(() => {
    const handleRefresh = async () => {
      try {
        if (currentUser) {
          // Force refresh the token
          const tokenResult = await currentUser.getIdTokenResult(true);
          setStatus("Session refreshed successfully! Redirecting...");

          // Get the redirect URL from search params
          const redirectUrl = searchParams.get("redirect") || "/";

          // Small delay to show success message
          setTimeout(() => {
            router.push(redirectUrl);
          }, 1000);
        } else {
          setStatus("No user found. Redirecting to login...");
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        setStatus("Failed to refresh session. Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    };

    handleRefresh();
  }, [currentUser, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {status}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we refresh your authentication token.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RefreshPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Loading...
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we refresh your authentication token.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <RefreshContent />
    </Suspense>
  );
}
