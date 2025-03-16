"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // Next.js router for navigation
  const handleLogin = async () => {
    if (!email || !password) {
      console.log("❌ Missing email or password.");
      toast.error("❌ Please enter both email and password.");
      return;
    }
  
  
    try {
      const response = await fetch("http://localhost:5000/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }), // ✅ Corrected variable names
      });
  
      const result = await response.text();
  
      let jsonData;
  
      try {
        jsonData = JSON.parse(result);
      } catch (error) {
        console.error("❌ JSON parsing error:", error);
        jsonData = result;
      }
  
      if (typeof jsonData === "object" && jsonData?._id) {
        toast.success("✅ Login Successful! Redirecting...");
        localStorage.setItem("user", JSON.stringify(jsonData));
      
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else if (jsonData === "0") {
        toast.error("❌ No such user found.");
      } else {
        toast.error("❌ Please enter a valid email or password.");
      }
      
    } catch (error) {
      console.error("🔥 Login error:", error);
      toast.error("❌ An unexpected error occurred.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />

      <Card className="w-full max-w-sm p-6 shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button className="w-full" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
