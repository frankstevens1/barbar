"use client";

import { useState } from "react";
import { Check, CheckCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@workspace/ui/components/popover";
import { Button } from "@workspace/ui/components/button";

const passwordRequirements = {
  option1: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, // Lowercase, Uppercase, Digit, Symbol
  option2: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, // Lowercase, Uppercase, Digit
  option3: /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/, // Letters and Digits
};

export const generatePassword = (length = 16, requirement: keyof typeof passwordRequirements = "option1") => {
  let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  if (requirement === "option2") charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  if (requirement === "option3") charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
  let password = "";
  do {
    password = Array.from({ length })
      .map(() => charset[Math.floor(Math.random() * charset.length)])
      .join("");
  } while (!passwordRequirements[requirement].test(password));
  
  return password;
};

function fallbackCopyText(text: string) {
  // Create a hidden textarea to hold the text
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Move off screen
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";

  document.body.appendChild(textArea);

  // Select the text
  textArea.select();
  textArea.setSelectionRange(0, 99999); // iOS Compatibility

  // Copy command
  document.execCommand("copy");

  // Cleanup
  document.body.removeChild(textArea);
}

interface PasswordGeneratorProps {
  onPasswordGenerated?: (password: string) => void;
  selectedRequirement?: "option1" | "option2" | "option3";
  size?: "sm" | "md";
}

const PasswordGenerator = ({ onPasswordGenerated, selectedRequirement = "option1", size = "sm" }: PasswordGeneratorProps) => {
  const [password, setPassword] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(16, selectedRequirement);
    setPassword(newPassword);
    setIsCopied(false);
    setOpen(true);
    if (onPasswordGenerated) {
      onPasswordGenerated(newPassword);
    }
  };

  const handleCopyToClipboard = async () => {
    if (password) {
      if (navigator.clipboard && window.isSecureContext) {
        // Modern API supported
        await navigator.clipboard.writeText(password);
      } else {
        // Fallback
        fallbackCopyText(password);
      }
      setIsCopied(true);
      toast.success("Password copied to clipboard.");
      setTimeout(() => {
        setIsCopied(false);
        setOpen(false);
      }, 200);
    }
  };

  const handleRegenerate = () => {
    handleGeneratePassword();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <p className="flex flex-row text-xs underline hover:cursor-pointer" onClick={handleGeneratePassword}>
          <ShieldCheck className="mr-2" size={14} />
          Generate Password
        </p>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-fit p-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className={`${size && size === "sm" ? "min-w-[208px]" : "min-w-[239px]"} w-full justify-between flex flex-row items-center gap-2 bg-muted px-1 rounded-lg`}>
            <div className="flex flex-col w-full items-center justify-center">
              <span className="text-nowrap tracking-wider text-xs">{password ? password : 'Regenerate...'}</span>
            </div>
            {password && (
              <div className="focus:outline-none focus:ring-0 p-0 hover:cursor-pointer" onClick={handleRegenerate}>
                <div className="p-1.5 rounded-lg hover:bg-muted-foreground hover:text-muted">
                  <RefreshCw size={14} />
                </div>
              </div>
            )}
          </div>
          <Button className="focus:outline-none focus:ring-0 w-7 h-6" variant="default" size="icon" onClick={handleCopyToClipboard}>
            {isCopied ? (
              <CheckCircle className="text-green-500" size={14} />
            ) : (
              <Check size={14} />
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PasswordGenerator;