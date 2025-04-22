// src/components/CopyToClipboard.tsx

import React, { useState, useEffect, useCallback } from "react";
import { MdOutlineContentCopy, MdCheck } from "react-icons/md"; // Using Material Design icons

interface CopyToClipboardProps {
  /**
   * The text content that will be copied to the clipboard.
   */
  textToCopy: string;
  /**
   * Optional text for the button when in the default state.
   * If not provided, only the icon will be shown.
   */
  buttonText?: string;
  /**
   * Optional text for the button when the copy is successful.
   * If not provided, only the success icon will be shown.
   */
  successText?: string;
  /**
   * Duration in milliseconds to show the success state.
   * @default 2000
   */
  successDuration?: number;
  /**
   * Additional CSS classes to apply to the button element.
   */
  className?: string;
  /**
   * Tooltip text to show on hover (useful if only showing icon).
   */
  tooltip?: string;
}

/**
 * A button component that copies the provided text to the clipboard
 * and provides visual feedback on success.
 */
export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  textToCopy,
  buttonText,
  successText,
  successDuration = 2000,
  className = "",
  tooltip = "Copy to clipboard",
}) => {
  const [isCopied, setIsCopied] = useState(false);

  // Reset the copied state after the specified duration
  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timerId = setTimeout(() => {
      setIsCopied(false);
    }, successDuration);

    // Cleanup function to clear the timeout if the component unmounts
    // or if the button is clicked again before the timeout finishes.
    return () => {
      clearTimeout(timerId);
    };
  }, [isCopied, successDuration]);

  const handleCopyClick = useCallback(async () => {
    if (!navigator.clipboard) {
      // Clipboard API not available (e.g., insecure context)
      console.error("Clipboard API not available.");
      // Optionally: Add user feedback here for unsupported browsers/contexts
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Optionally: Add user feedback here for copy failure
      setIsCopied(false); // Ensure state is reset on failure
    }
  }, [textToCopy]);

  // Base button classes - adjust as needed for your design system
  const baseClasses =
    "inline-flex items-center justify-center gap-x-1.5 px-2.5 py-1.5 text-sm font-medium border rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // State-specific classes
  const idleClasses =
    "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500";
  const successClasses =
    "border-green-300 bg-green-50 text-green-700 focus:ring-green-500";

  // Combine classes
  const combinedClassName = `${baseClasses} ${
    isCopied ? successClasses : idleClasses
  } ${className}`;

  return (
    <button
      type="button"
      className={combinedClassName}
      onClick={handleCopyClick}
      title={tooltip} // Add tooltip for hover hint
      aria-label={isCopied ? "Content copied" : "Copy content to clipboard"}
      aria-live="polite" // Announce changes politely
    >
      {isCopied ? (
        <>
          <MdCheck className="h-4 w-4" aria-hidden="true" />
          {successText && <span>{successText}</span>}
        </>
      ) : (
        <>
          <MdOutlineContentCopy className="h-4 w-4" aria-hidden="true" />
          {buttonText && <span>{buttonText}</span>}
        </>
      )}
    </button>
  );
};
