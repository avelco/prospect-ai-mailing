// src/components/CopyToClipboard.tsx

import React, { useState, useEffect, useCallback } from "react";
import { MdOutlineContentCopy, MdCheck } from "react-icons/md";

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

  const handleCopyClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent event bubbling

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
    },
    [textToCopy]
  );

  // For icon-only buttons (which is our primary use case)
  if (!buttonText && !successText) {
    return (
      <button
        type="button"
        onClick={handleCopyClick}
        title={tooltip}
        aria-label={isCopied ? "Contenido copiado" : "Copiar al portapapeles"}
        className={`p-1 rounded-full transition-colors duration-150 focus:outline-none ${
          isCopied
            ? "text-green-600 bg-green-50 hover:bg-green-100"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        } ${className}`}
      >
        {isCopied ? (
          <MdCheck className="h-4 w-4" aria-hidden="true" />
        ) : (
          <MdOutlineContentCopy className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    );
  }

  // For buttons with text (secondary use case)
  return (
    <button
      type="button"
      onClick={handleCopyClick}
      title={tooltip}
      aria-label={isCopied ? "Contenido copiado" : "Copiar al portapapeles"}
      className={`inline-flex items-center gap-x-1.5 px-2 py-1 rounded text-xs font-medium transition-colors duration-150 focus:outline-none ${
        isCopied
          ? "text-green-700 bg-green-50 hover:bg-green-100"
          : "text-gray-600 bg-gray-50 hover:bg-gray-100"
      } ${className}`}
    >
      {isCopied ? (
        <>
          <MdCheck className="h-3.5 w-3.5" aria-hidden="true" />
          {successText && <span>{successText}</span>}
        </>
      ) : (
        <>
          <MdOutlineContentCopy className="h-3.5 w-3.5" aria-hidden="true" />
          {buttonText && <span>{buttonText}</span>}
        </>
      )}
    </button>
  );
};
