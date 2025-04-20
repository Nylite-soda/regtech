import { z } from "zod";

export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): ValidationError | null => {
  if (!email) {
    return { field: "email", message: "Email is required" };
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: "email", message: "Please enter a valid email address" };
  }

  // Extract domain from email
  const domain = email.split('@')[1];
  
  // Check for common disposable email domains
  const disposableDomains = [
    'tempmail.com', 'temp-mail.org', 'guerrillamail.com', 'sharklasers.com',
    'mailinator.com', 'yopmail.com', 'throwawaymail.com', '10minutemail.com',
    'trashmail.com', 'dispostable.com', 'maildrop.cc', 'mailnesia.com',
    'tempmail.net', 'fakeinbox.com', 'getairmail.com', 'mailcatch.com',
    'spamgourmet.com', 'spam4.me', 'tempmailaddress.com', 'tempmail.ninja',
    'tempmail.space', 'tempmail.de', 'tempmail.co', 'tempmail.org'
  ];
  
  if (disposableDomains.includes(domain.toLowerCase())) {
    return { field: "email", message: "Please use a valid email address (disposable emails not allowed)" };
  }
  
  // Check for valid TLD (top-level domain)
  const validTLDs = [
    'com', 'org', 'net', 'edu', 'gov', 'mil', 'biz', 'info', 'name', 'mobi',
    'app', 'io', 'co', 'uk', 'us', 'ca', 'au', 'de', 'fr', 'jp', 'cn', 'ru',
    'br', 'in', 'it', 'es', 'nl', 'ch', 'se', 'no', 'dk', 'fi', 'pl', 'cz',
    'hu', 'at', 'be', 'gr', 'pt', 'ie', 'nz', 'za', 'mx', 'ar', 'cl', 'pe',
    'co', 've', 'ec', 'uy', 'py', 'bo', 'pe', 'co', 've', 'ec', 'uy', 'py',
    'bo', 'pe', 'co', 've', 'ec', 'uy', 'py', 'bo', 'pe', 'co', 've', 'ec',
    'uy', 'py', 'bo', 'pe', 'co', 've', 'ec', 'uy', 'py', 'bo', 'pe', 'co',
    've', 'ec', 'uy', 'py', 'bo', 'pe', 'co', 've', 'ec', 'uy', 'py', 'bo'
  ];
  
  const tld = domain.split('.').pop()?.toLowerCase();
  if (!tld || !validTLDs.includes(tld)) {
    return { field: "email", message: "Please use an email address with a valid domain" };
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

  if (name.length < 3) {
    return { field: "name", message: "Name must be at least 3 characters long" };
  }
  if (name.length > 20) {
    return { field: "name", message: "Name must be at most 20 characters long" };
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

  // For react-phone-input-2, the value includes country code
  // We need at least 10 digits (country code + number)
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    return { field: "phone", message: "Please enter a valid phone number" };
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

// Confirm password validation
export const validateConfirmPassword = (confirmPassword: string, password: string): ValidationError | null => {
  if (!confirmPassword) {
    return { field: "confirmPassword", message: "Confirm password is required" };
  }
  
  if (confirmPassword !== password) {
    return { field: "confirmPassword", message: "Passwords do not match" };
  }
  
  return null;
};

// Terms acceptance validation
export const validateTermsAccepted = (termsAccepted: boolean): ValidationError | null => {
  if (!termsAccepted) {
    return { field: "termsAccepted", message: "You must accept the Terms and Conditions" };
  }
  
  return null;
};

// Privacy policy acceptance validation
export const validatePrivacyAccepted = (privacyAccepted: boolean): ValidationError | null => {
  if (!privacyAccepted) {
    return { field: "privacyAccepted", message: "You must accept the Privacy Policy" };
  }
  
  return null;
};

// Validate a single field
export const validateFormField = (name: string, value: string | boolean, password?: string): string | null => {
  switch (name) {
    case 'firstName':
    case 'lastName':
      if (typeof value === 'string') {
        const nameError = validateName(value);
        return nameError ? nameError.message : null;
      }
      return null;
    case 'email':
      if (typeof value === 'string') {
        const emailError = validateEmail(value);
        return emailError ? emailError.message : null;
      }
      return null;
    case 'password':
      if (typeof value === 'string') {
        const passwordError = validatePassword(value);
        return passwordError ? passwordError.message : null;
      }
      return null;
    case 'confirmPassword':
      if (typeof value === 'string' && password) {
        const confirmPasswordError = validateConfirmPassword(value, password);
        return confirmPasswordError ? confirmPasswordError.message : null;
      }
      return null;
    case 'phone':
      if (typeof value === 'string') {
        const phoneError = validatePhone(value);
        return phoneError ? phoneError.message : null;
      }
      return null;
    case 'termsAccepted':
      if (typeof value === 'boolean') {
        const termsError = validateTermsAccepted(value);
        return termsError ? termsError.message : null;
      }
      return null;
    case 'privacyAccepted':
      if (typeof value === 'boolean') {
        const privacyError = validatePrivacyAccepted(value);
        return privacyError ? privacyError.message : null;
      }
      return null;
    default:
      return null;
  }
}; 