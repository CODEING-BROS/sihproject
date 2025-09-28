import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Github, Loader2 } from "lucide-react";
import AuthNavbar from "@/components/frontendComponents/AuthNavbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/user/register",
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("User Registration successful!");
        setInput({ username: "", email: "", password: "" });
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    toast.info("Redirecting to GitHub...");
    // GitHub OAuth logic here
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <AuthNavbar />

      {/* ✅ Centering container with improved padding */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md border border-gray-800 bg-white/5 backdrop-blur-sm text-white rounded-2xl shadow-2xl animate-fade-in">
          <CardHeader className="flex flex-col items-center gap-1 py-5 px-6">
            <CardTitle className="text-3xl font-extrabold text-center tracking-tight leading-tight text-white mb-1">
              Create your account
            </CardTitle>
            <span className="text-gray-400 text-sm sm:text-base">
              Sign up to DevPair
            </span>
          </CardHeader>

          <CardContent className="px-8 pb-4 ">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white font-semibold text-sm">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="e.g. devmaster"
                  value={input.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  className="bg-gray-900 border-gray-700 text-white focus:ring-2 focus:ring-primary focus:border-primary/50 placeholder-gray-400 transition-all rounded-md"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-semibold text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@devmail.com"
                  value={input.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="bg-gray-900 border-gray-700 text-white focus:ring-2 focus:ring-primary focus:border-primary/50 placeholder-gray-400 transition-all rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-semibold text-sm">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={input.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="bg-gray-900 border-gray-700 text-white focus:ring-2 focus:ring-primary focus:border-primary/50 placeholder-gray-400 transition-all rounded-md"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full bg-primary hover:bg-primary/90 transition font-bold py-3 rounded-lg shadow-lg focus:ring-4 focus:ring-primary/60 focus:outline-none flex justify-center items-center gap-2 ${
                  loading ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                {loading && <Loader2 className="animate-spin w-5 h-5" aria-label="Loading" />}
                Sign Up
              </Button>
            </form>

            <div className="relative my-7 flex items-center" aria-hidden="true">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="mx-4 text-xs text-gray-500 font-medium">or</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <Button
              variant="outline"
              onClick={handleGitHubLogin}
              className="w-full flex items-center justify-center gap-3 border-gray-700 bg-gray-900 text-gray-200 rounded-lg hover:bg-blue-700 hover:text-white hover:border-blue-600 transition font-semibold py-3 focus:ring-4 focus:ring-blue-600 focus:outline-none"
              aria-label="Sign up with GitHub"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">Sign up with GitHub</span>
            </Button>

            <div className="mt-7 text-sm text-center text-gray-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-primary hover:underline font-medium focus:underline focus:outline-none"
              >
                Sign In
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      <style>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s 0.1s both cubic-bezier(0.4, 0, 0.2, 1);
        }
        .bg-primary {
          background: linear-gradient(90deg, #9333ea 0%, #4f46e5 100%);
        }
        .text-primary {
          color: #a78bfa !important;
        }
        .focus\:ring-primary:focus {
          --tw-ring-color: #a78bfa;
        }
        .hover\:border-primary:hover {
          border-color: #a78bfa;
        }
      `}</style>
    </div>
  );
};

export default Signup;