import { Button } from "@/components/ui/button";
import conf from "@/conf/conf";
import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${conf.backendUrl}/auth/forgot-password`,
        { email: emailInput },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(res.data.message);
      setIsEmailSent(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Something went wrong.");
      } else {
        toast.error("Server error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 dark:bg-neutral-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-800 rounded-lg shadow-md border">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          Forgot Password
        </h2>

        {!isEmailSent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Enter your email to receive password reset instructions.
            </p>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="font-medium text-sm text-gray-800 dark:text-white"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="you@example.com"
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {isLoading ? "Sending..." : "Recover Password"}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-medium">
              Check your email for further instructions.
            </p>
            <button
              onClick={() => setIsEmailSent(false)}
              className="text-sm text-blue-600 hover:underline"
            >
              Didn’t receive the email?
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/auth"
            className="text-sm text-blue-600 hover:underline hover:text-blue-800"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
