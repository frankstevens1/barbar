"use client";

import { useState } from "react";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import PasswordGenerator from "./password-generator";
import { Eye, EyeOff, CheckCircle, XCircle, Circle } from "lucide-react";

const passwordRequirements = {
  option1: [
    { label: "At least one lowercase letter", regex: /[a-z]/ },
    { label: "At least one uppercase letter", regex: /[A-Z]/ },
    { label: "At least one digit", regex: /\d/ },
    { label: "At least one special character", regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ },
    { label: "At least 8 characters long", regex: /.{8,}/ }
  ],
  option2: [
    { label: "At least one lowercase letter", regex: /[a-z]/ },
    { label: "At least one uppercase letter", regex: /[A-Z]/ },
    { label: "At least one digit", regex: /\d/ },
    { label: "At least 8 characters long", regex: /.{8,}/ }
  ],
  option3: [
    { label: "At least one letter", regex: /[a-zA-Z]/ },
    { label: "At least one digit", regex: /\d/ },
    { label: "At least 8 characters long", regex: /.{8,}/ }
  ]
};

type PasswordRequirementOptions = "option1" | "option2" | "option3";

interface PasswordInputProps {
  selectedRequirement?: PasswordRequirementOptions;
  onValidationChange?: (isValid: boolean) => void;
  /**
   * Passes the current password string back to the parent, so
   * that parent components (ResetPassword, SignUp, etc.) can
   * compare or handle it (e.g., confirm password).
   */
  onPasswordChange?: (password: string) => void;
  size?: "sm" | "md";
}

export default function PasswordInput({
  selectedRequirement = "option1",
  onValidationChange,
  onPasswordChange,
  size = "sm",
}: PasswordInputProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [failedRequirements, setFailedRequirements] = useState<string[]>([]);

  const validatePassword = (newPassword: string) => {
    const requirements = passwordRequirements[selectedRequirement];
    const unmetRequirements = requirements
      .filter(({ regex }) => !regex.test(newPassword))
      .map(({ label }) => label);

    setFailedRequirements(unmetRequirements);
    const currentIsValid = unmetRequirements.length === 0;
    setIsValid(currentIsValid);

    // Notify parent component about validity
    onValidationChange?.(currentIsValid);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    // Pass the password up to the parent
    onPasswordChange?.(newPassword);
  };

  const handlePasswordGenerated = (generatedPassword: string) => {
    setPassword(generatedPassword);
    validatePassword(generatedPassword);
    // Pass generated password up to parent as well
    onPasswordChange?.(generatedPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-2 mb-3">
      <div className="flex justify-between items-center">
        <Label htmlFor="password">Password</Label>
        <PasswordGenerator
          selectedRequirement={selectedRequirement}
          onPasswordGenerated={handlePasswordGenerated}
          size={size}
        />
      </div>

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Your password"
          value={password}
          onChange={handlePasswordChange}
          minLength={8}
          required
          className={`pr-10 ${
            isValid === null || password.length === 0
              ? ""
              : isValid
              ? "border-green-500"
              : "border-red-500"
          }`}
          // Turn off autofill in a hacky way:
          autoComplete="off"
          readOnly
          onFocus={(e) => e.target.removeAttribute("readonly")}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      
      <ul className="text-sm text-gray-600">
        {passwordRequirements[selectedRequirement].map(({ label }) => {
          if (password.length === 0) {
            return (
              <li key={label} className="flex items-center gap-2">
                <Circle className="text-gray-400" size={14} />
                {label}
              </li>
            );
          }
          return failedRequirements.includes(label) ? (
            <li key={label} className="flex items-center gap-2">
              <XCircle className="text-red-500" size={14} />
              {label}
            </li>
          ) : (
            <li key={label} className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={14} />
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
