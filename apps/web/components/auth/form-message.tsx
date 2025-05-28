"use client";

import { Message } from "@workspace/supabase/types";
import { XCircle } from "lucide-react";
import { useState } from "react";

// A banner at the top center that can be dismissed
export function FormMessage({ message }: { message?: Message }) {
  // Manage visibility of the banner
  const [isVisible, setIsVisible] = useState(true); // <task: add a way to dismiss the banner; severity: low>

  // If there's no message or it was dismissed, don’t show anything
  if (!message || !isVisible) return null;

  // Determine which message to show in priority: success -> error -> message
  let text = message.success || message.error || message.message;

  // If no text is found, do nothing
  if (!text) return null;

  // Replace URLs with a clickable "Check the docs" link
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  text = text.replace(urlRegex, '<a href="$1" target="_blank" class="underline text-blue-600">Check the docs</a>.');

  // Pick a style color based on message type
  let bannerClasses = "bg-blue-50 border-blue-200 text-blue-800";
  if (message.success) {
    bannerClasses = "bg-green-50 border-green-300 text-green-800";
  } else if (message.error) {
    bannerClasses = "bg-red-50 border-red-300 text-red-800";
  }

  return (
    <div
      className={`
        absolute w-[275px] top-4 left-1/2 transform -translate-x-1/2 border p-3 z-50 flex items-center justify-between shadow-lg rounded-md
        ${bannerClasses}
      `}
    >
      <div className="relative flex items-center">
        <XCircle size={16} onClick={() => setIsVisible(false)} className="hover:cursor-pointer bg-background rounded-full absolute left-[-20] top-[-20]" />
        <span
          className="text-sm font-medium text-center"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    </div>
  );
}