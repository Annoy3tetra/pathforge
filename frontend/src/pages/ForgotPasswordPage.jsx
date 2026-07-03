import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

import { AuthLayout } from "../layouts/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ENDPOINTS } from "../api/endpoints";

function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await API.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      setSubmitted(true);
      toast.success("Password reset request sent!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout 
        title="Check your inbox" 
        subtitle="We've sent a link to recover your password"
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-500 leading-relaxed text-center">
            If <strong className="text-slate-700">{email}</strong> matches an account in our system, you will receive an email shortly with a password recovery link.
          </p>
          <div className="pt-2 text-center">
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors text-sm">
              Return to Login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email to request a reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email address
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Send Reset Link
        </Button>
        
        <p className="text-center text-sm text-slate-500 mt-6">
          Remembered your password?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
