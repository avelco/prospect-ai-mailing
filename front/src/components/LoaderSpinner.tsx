// src/components/Loader.tsx

import React from "react";

// Define the possible sizes for the loader
type LoaderSize = "sm" | "md" | "lg" | "xl";

// Define the props for the Loader component
interface LoaderProps {
  /**
   * The size of the spinner.
   * @default 'md'
   */
  size?: LoaderSize;
  /**
   * Optional text to display below the spinner.
   */
  text?: string;
  /**
   * Tailwind CSS class for the spinner color (e.g., 'border-blue-500').
   * Uses border color, not text color.
   * @default 'border-blue-500'
   */
  color?: string;
  /**
   * If true, the loader will cover the entire screen with a semi-transparent backdrop.
   * @default false
   */
  fullscreen?: boolean;
  /**
   * Additional CSS classes to apply to the container element.
   */
  className?: string;
  /**
   * CSS classes for the text element, if text is provided.
   * @default 'text-sm text-gray-600'
   */
  textClassName?: string;
}

/**
 * A reusable loading indicator component with customizable size, color, text,
 * and an optional fullscreen overlay.
 */
export const LoaderSpinner: React.FC<LoaderProps> = ({
  size = "md",
  text,
  color = "border-blue-500", // Default to blue border
  fullscreen = false,
  className = "",
  textClassName = "text-sm text-gray-600", // Default text style
}) => {
  // Map size prop to Tailwind classes
  const sizeClasses: Record<LoaderSize, string> = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-[5px]", // Use arbitrary value for thicker border if needed
    xl: "h-16 w-16 border-[6px]",
  };

  // Base classes for the spinner
  const spinnerBaseClasses =
    "animate-spin rounded-full border-solid border-t-transparent";

  // Combine all spinner classes
  const spinnerClasses = `${spinnerBaseClasses} ${sizeClasses[size]} ${color}`;

  // Classes for the main container
  const containerClasses = `flex flex-col items-center justify-center ${className}`;

  // Screen reader text
  const srText = text || "Loading..."; // Use provided text or default for screen readers

  const loaderContent = (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className={spinnerClasses}>
        {/* Visually hidden text for screen readers */}
        <span className="sr-only">{srText}</span>
      </div>
      {text && <p className={`mt-2 ${textClassName}`}>{text}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm"
        aria-modal="true"
        aria-busy="true"
      >
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};
