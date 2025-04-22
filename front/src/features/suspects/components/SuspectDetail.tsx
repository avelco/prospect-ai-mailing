// src/components/SuspectDetail.jsx

// Import icons from react-icons (Material Design set)
import {
    MdOutlineEmail,
    MdOutlinePhone,
    MdOutlineLocationOn,
} from "react-icons/md";
import { useSuspect } from "../../../hooks/useSuspect";
import { LoaderSpinner } from "../../../components/LoaderSpinner";
import { CopyToClipboard } from "../../../components/CopyToClipboard";

export const SuspectDetail = () => {
    const { data, isLoading } = useSuspect();

    // Improved Loading State
    if (isLoading) {
        return (
            <LoaderSpinner />  
        );
    }

    // Handle case where data might not be available after loading
    if (!data) {
        return (
            <div className="py-4 text-center text-red-600">
                Could not load suspect details.
            </div>
        );
    }

    return (
        // Use space-y to add vertical spacing between direct children
        <div className="space-y-4">
            {/* Suspect Name - Larger, bolder */}
            <h2 className="text-xl font-semibold text-gray-900">{data.name}</h2>

            {/* Details Section - Smaller text, gray color, icons for clarity */}
            <div className="space-y-2 text-sm text-gray-700">
                {data.email && (
                    <p className="flex items-center gap-2">
                        {/* Use react-icons component */}
                        <MdOutlineEmail
                            className="h-4 w-4 flex-shrink-0 text-gray-500"
                            aria-hidden="true"
                        />
                        <span>{data.email}</span>
                        <CopyToClipboard
                            textToCopy={data.email}
                            tooltip="Copy email address"
                        />
                    </p>
                )}
                {data.phone && (
                    <p className="flex items-center gap-2">
                        {/* Use react-icons component */}
                        <MdOutlinePhone
                            className="h-4 w-4 flex-shrink-0 text-gray-500"
                            aria-hidden="true"
                        />
                        <span>{data.phone}</span>
                        <CopyToClipboard
                            textToCopy={data.phone}
                            tooltip="Copy phone number"
                        />
                    </p>
                )}
                {/* Combine City and Country if both exist */}
                {(data.city || data.country) && (
                    <p className="flex items-center gap-2">
                        {/* Use react-icons component */}
                        <MdOutlineLocationOn
                            className="h-4 w-4 flex-shrink-0 text-gray-500"
                            aria-hidden="true"
                        />
                        <span>{[data.city, data.country].filter(Boolean).join(", ")}</span>
                    </p>
                )}
            </div>
        </div>
    );
};
