"use client";

import { useEffect, useState } from "react";

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  met: boolean;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0);
  const [requirements, setRequirements] = useState<Requirement[]>([
    { label: "At least 8 characters", met: false },
    { label: "Contains uppercase letter", met: false },
    { label: "Contains lowercase letter", met: false },
    { label: "Contains number", met: false },
    { label: "Contains special character", met: false },
  ]);

  useEffect(() => {
    const newRequirements: Requirement[] = [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
      { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
      { label: "Contains number", met: /[0-9]/.test(password) },
      { label: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    setRequirements(newRequirements);
    
    const metRequirements = newRequirements.filter(req => req.met).length;
    const strengthPercentage = (metRequirements / newRequirements.length) * 100;
    setStrength(strengthPercentage);
  }, [password]);

  const getStrengthColor = () => {
    if (strength < 20) return "bg-[#AD0000]";
    if (strength < 40) return "bg-orange-500";
    if (strength < 60) return "bg-yellow-500";
    if (strength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength < 20) return "Very Weak";
    if (strength < 40) return "Weak";
    if (strength < 60) return "Medium";
    if (strength < 80) return "Strong";
    return "Very Strong";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 rounded-full bg-gray-200 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strength}%` }}
          />
        </div>
        <span className={`text-xs text-white font-medium ${getStrengthColor()} p-2 py-1 rounded-full`}>
          {getStrengthText()}
        </span>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p className="font-medium">Password Requirements:</p>
        <ul className="space-y-1">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className={req.met ? "text-green-500" : "text-gray-400"}>
                {req.met ? "✓" : "○"}
              </span>
              <span className={req.met ? "text-gray-600" : "text-gray-400"}>
                {req.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 