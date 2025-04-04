import { z } from "zod";

export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): ValidationError | null => {
  if (!email) {
    return { field: "email", message: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: "email", message: "Please enter a valid email address" };
  }

  return null;
};

export const validatePassword = (password: string): ValidationError | null => {
  if (!password) {
    return { field: "password", message: "Password is required" };
  }

  if (password.length < 8) {
    return { field: "password", message: "Password must be at least 8 characters long" };
  }

  if (!/[A-Z]/.test(password)) {
    return { field: "password", message: "Password must contain at least one uppercase letter" };
  }

  if (!/[a-z]/.test(password)) {
    return { field: "password", message: "Password must contain at least one lowercase letter" };
  }

  if (!/[0-9]/.test(password)) {
    return { field: "password", message: "Password must contain at least one number" };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { field: "password", message: "Password must contain at least one special character" };
  }

  return null;
};

export const validateName = (name: string): ValidationError | null => {
  if (!name) {
    return { field: "name", message: "Name is required" };
  }

  if (name.length < 2) {
    return { field: "name", message: "Name must be at least 2 characters long" };
  }

  if (!/^[a-zA-Z\s]*$/.test(name)) {
    return { field: "name", message: "Name can only contain letters and spaces" };
  }

  return null;
};

export const validatePhone = (phone: string): ValidationError | null => {
  if (!phone) {
    return { field: "phone", message: "Phone number is required" };
  }

  // International phone number format (E.164)
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone)) {
    return { field: "phone", message: "Please enter a valid phone number with country code" };
  }

  return null;
};

export function validateCompanyFields(role: string, fields: Record<string, string>): ValidationError | null {
  if (role === "company") {
    if (!fields.companyName) {
      return { field: "companyName", message: "Company name is required" };
    }
    if (!fields.companyAddress) {
      return { field: "companyAddress", message: "Company address is required" };
    }
    if (!fields.companyPhone) {
      return { field: "companyPhone", message: "Company phone is required" };
    }
  }
  return null;
}

export function validateWebsite(website: string): ValidationError | null {
  if (!website) return null; // Website is optional
  if (!/^https?:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/.test(website)) {
    return {
      field: "companyWebsite",
      message: "Please enter a valid website URL (e.g., https://example.com)"
    };
  }
  return null;
}

export function validateSignInEmail(email: string): ValidationError | null {
  if (!email) {
    return { field: "email", message: "Email is required" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { field: "email", message: "Please enter a valid email address" };
  }
  return null;
}

export function validateSignInPassword(password: string): ValidationError | null {
  if (!password) {
    return { field: "password", message: "Password is required" };
  }
  if (password.length < 8) {
    return { field: "password", message: "Password must be at least 8 characters" };
  }
  return null;
}

export function validateSignInPhone(phone: string): ValidationError | null {
  if (!phone) {
    return { field: "phone", message: "Phone number is required" };
  }
  // International phone number format (E.164)
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone)) {
    return { field: "phone", message: "Please enter a valid phone number with country code" };
  }
  return null;
}

export function validateVerificationCode(code: string): ValidationError | null {
  if (!code) {
    return { field: "code", message: "Verification code is required" };
  }
  if (!/^\d{6}$/.test(code)) {
    return { field: "code", message: "Verification code must be 6 digits" };
  }
  return null;
}

export const validateSubscriptionPlan = (plan: string): ValidationError | null => {
  const validPlans = ["basic", "standard", "premium"];
  if (!validPlans.includes(plan)) {
    return { field: "subscriptionPlan", message: "Please select a valid subscription plan" };
  }
  return null;
};

export const validateSignIn = (data: {
  email: string;
  password: string;
}) => {
  const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  return schema.safeParse(data);
}; 