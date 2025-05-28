"use client";

import { FormEvent, useState } from "react";
import { resetPasswordAction } from "@workspace/supabase/lib/auth-actions";
import { SubmitButton } from "../submit-button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "sonner";
import PasswordInput from "../password-input";
import { CheckCircle, XCircle, Circle } from "lucide-react";
import { useResolvedParams } from "@workspace/supabase/lib/utils/use-resolved-params";
import { FormMessage } from "../form-message";
import { Message } from "@workspace/supabase/types";
import { useSecureDomain } from "@workspace/supabase/hooks/use-domain";

interface PageProps {
  searchParams: Promise<Message & { redirectTo?: string }>;
  requirements_option: "option1" | "option2" | "option3";
}

export default function ResetPassword({
  searchParams,
  requirements_option = "option1"
}: PageProps) {
  const resolvedParams = useResolvedParams(searchParams);
  const domain = useSecureDomain();
  const base_url = "https://" + domain.subdomain + domain.domain;

  // Track main password & confirm password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Track password validity from PasswordInput
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // Intercept form submission for front-end validations
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!isPasswordValid) {
      e.preventDefault();
      toast.error("Invalid password", {
        description: "Please ensure your password meets the requirements"
      });
      return;
    }
    if (password !== confirmPassword) {
      e.preventDefault();
      toast.error("Failed to match", {
        description: "Please make sure both password fields match"
      });
      return;
    }
    // Otherwise, allow the form action to proceed.
  };

  // Determine confirm-password icon and validation text
  let confirmIcon = null;
  let confirmValidationText = "Confirm your password";
  let confirmBorderClass = "";
  if (confirmPassword.length === 0) {
    confirmIcon = <Circle size={16} className="text-gray-400" />;
  } else if (confirmPassword === password) {
    confirmIcon = <CheckCircle size={16} className="text-green-500" />;
    confirmValidationText = "Passwords match";
    confirmBorderClass = "border-green-500";
  } else {
    confirmIcon = <XCircle size={16} className="text-red-500" />;
    confirmValidationText = "Passwords do not match";
    confirmBorderClass = "border-red-500";
  }

  return (
    <form
      onSubmit={handleSubmit}
      action={resetPasswordAction}
      className="flex-1 flex flex-col w-full gap-2 text-foreground min-w-64 max-w-64 mx-auto"
    >
      <div className="flex flex-col max-w-sm gap-4">
        <h1 className="text-2xl font-medium">Reset password</h1>
        <p className="text-sm text-foreground/60">
          Please enter your new password below.
        </p>

        {/* Main password input with validation */}
        <PasswordInput
          selectedRequirement={requirements_option}
          onValidationChange={setIsPasswordValid}
          onPasswordChange={setPassword}
        />

        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative flex flex-col gap-2">
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            required
            autoComplete="off"
            readOnly
            onFocus={(e) => e.target.removeAttribute("readonly")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`pr-10 ${confirmBorderClass}`}
          />
          <ul className="flex text-sm text-gray-600">
            <li className="flex items-center gap-2">
              {confirmIcon}
              {confirmValidationText}
            </li>
          </ul>
        </div>

        <SubmitButton formAction={resetPasswordAction}>
          Reset password
        </SubmitButton>

        <FormMessage message={resolvedParams} />
      </div>
    </form>
  );
}
