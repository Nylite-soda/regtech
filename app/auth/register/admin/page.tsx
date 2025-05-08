"use client";

import { useState, useEffect } from "react";
import { BASE_URL } from "@/lib/utils";
import { validateName, validatePassword } from "@/lib/validation";
import { useRouter } from "next/navigation";

export default function AdminRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formComplete, setFormComplete] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Check if all required fields are filled and valid
  useEffect(() => {
    const isFormFilled =
      formData.first_name.trim() !== "" &&
      formData.last_name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.confirm_password.trim() !== "";

    const hasNoErrors =
      Object.keys(errors).filter((key) => errors[key] !== "").length === 0;

    setFormComplete(
      isFormFilled &&
        hasNoErrors &&
        formData.password === formData.confirm_password
    );
  }, [formData, errors]);

  // Calculate password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[a-z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;

    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate on change for better user experience
    let errorMessage = "";

    if (name === "first_name") {
      const error = validateName(value);
      if (error) errorMessage = error.message;
    } else if (name === "last_name") {
      const error = validateName(value);
      if (error) errorMessage = error.message;
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.trim() && !emailRegex.test(value)) {
        errorMessage = "Please enter a valid email address";
      }
    } else if (name === "password") {
      const error = validatePassword(value);
      if (error) errorMessage = error.message;

      // Check confirm password match if it exists
      if (formData.confirm_password && value !== formData.confirm_password) {
        setErrors({ ...errors, confirm_password: "Passwords do not match" });
      } else if (formData.confirm_password) {
        setErrors({ ...errors, confirm_password: "" });
      }
    } else if (name === "confirm_password") {
      if (formData.password !== value) {
        errorMessage = "Passwords do not match";
      }
    }

    setErrors({ ...errors, [name]: errorMessage });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate first name
    const firstNameError = validateName(formData.first_name);
    if (firstNameError) {
      newErrors.first_name = firstNameError.message;
    }

    // Validate last name
    const lastNameError = validateName(formData.last_name);
    if (lastNameError) {
      newErrors.last_name = lastNameError.message;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError.message;
    }

    // Validate confirm password
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Create the payload to match the backend's expected UserCreate schema
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
      };

      const response = await fetch(`${BASE_URL}/api/v1/auth/register-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.detail ||
            data.detail.msg ||
            data.detail.message ||
            "Registration failed"
        );
      }

      // Handle successful registration
      setMessage({
        text: "Admin account created successfully!",
        type: "success",
      });

      // Store the access token from the response
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }

      // Clear form after successful submission
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
      });

      // Redirect or perform other actions as needed
      setTimeout(() => {
        console.log("Registration successful, ready to redirect");
      }, 2000);
      router.push("/auth/signin/admin");
    } catch (error: any) {
      setMessage({
        text:
          error.message || "Failed to create admin account. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="m-auto w-full max-w-lg p-8 bg-white rounded-xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Registration
          </h1>
          <div className="h-1 w-16 bg-red-600 mx-auto mt-2 mb-4"></div>
          <p className="text-gray-600">
            Create a new administrator account with full privileges
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 flex items-center ${
              message.type === "success"
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-red-50 border-red-500 text-red-700"
            }`}
          >
            <span className="mr-2">
              {message.type === "success" ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
            {message.text}
          </div>
        )}

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`pl-10 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.first_name
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-red-200 focus:border-red-500"
                  }`}
                  placeholder="John"
                />
              </div>
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`pl-10 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.last_name
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-red-200 focus:border-red-500"
                  }`}
                  placeholder="Doe"
                />
              </div>
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-red-200 focus:border-red-500"
                }`}
                placeholder="admin@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-red-200 focus:border-red-500"
                }`}
                placeholder="••••••••"
              />
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div
                    className={`h-2 rounded-full ${getStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {passwordStrength === 0 && "Enter a password"}
                  {passwordStrength <= 2 &&
                    passwordStrength > 0 &&
                    "Weak password"}
                  {passwordStrength === 3 && "Medium strength"}
                  {passwordStrength >= 4 && "Strong password"}
                </p>
              </div>
            )}
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={`pl-10 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.confirm_password
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-red-200 focus:border-red-500"
                }`}
                placeholder="••••••••"
              />
              {formData.password &&
                formData.confirm_password &&
                formData.password === formData.confirm_password && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
            </div>
            {errors.confirm_password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirm_password}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !formComplete}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-md transform transition-all duration-300 ${
                isLoading || !formComplete
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 hover:shadow-lg active:scale-98"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Admin Account"
              )}
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>
              By creating an account, you agree to our{" "}
              <a href="/terms" className="text-[#AD0000]">
                terms and conditions
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
