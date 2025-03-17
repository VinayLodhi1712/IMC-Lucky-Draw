"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/userAuth";
import PulseLoader from "react-spinners/PulseLoader";

export default function CheckLogin(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const [auth, setAuth] = useAuth();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/userAuth`,
            {
              headers: {
                authorization: auth?.token,
              },
            }
          );

          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setIsAuthenticated(true);
            }
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
        } finally {
          setLoading(false);
        }
      };

      if (typeof window !== "undefined") {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth && auth?.token) {
          checkAuth();
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    }, [auth?.token]);

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push("/");
      }
    }, [loading, isAuthenticated, router]);


    // Show loading spinner while checking authentication
    if (loading) {
      return (
        <div className="flex justify-center w-100 h-screen items-center gap-4">
          <p className="font-bold text-3xl">Checking Authentication</p>
          <PulseLoader />
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex justify-center w-100 h-screen items-center">
          <p className="font-bold text-3xl">Please login redirecting...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
