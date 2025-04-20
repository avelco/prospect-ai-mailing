import { useState } from "react";
import ParticipantTable from "../components/ParticipantTable";
import { VscCommentDraft } from "react-icons/vsc";
import { RiMailSendLine } from "react-icons/ri";
import { FaUsersBetweenLines } from "react-icons/fa6";
import { SentTable } from "../components/SentTable";
import DraftsTable from "../components/DraftsTable";

const TABS = [
    { key: "Participants", label: "Participantes", icon: <FaUsersBetweenLines /> },
    { key: "Drafts", label: "Borradores", icon: <VscCommentDraft /> },
    { key: "Sent", label: "Enviados", icon: <RiMailSendLine /> },
];

const ParticipantPage = () => {
    const [activeTab, setActiveTab] = useState<string>("Participants");

    return (
        <div className="flex flex-nowrap items-start justify-center overflow-x-auto px-4 py-6 lg:gap-8 lg:p-8">
            <div className="flex flex-col rounded-lg border border-neutral-200 bg-white shadow p-0 sm:col-span-2 lg:col-span-4">
                <div className="flex justify-center border-b border-gray-200 mb-8">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            className={`flex items-center gap-2 px-6 py-3 -mb-px border-b-2 font-medium transition
                ${activeTab === tab.key
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-blue-600"
                                }`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === "Participants" && (
                        <div>
                            <ParticipantTable />
                        </div>
                    )}
                    {activeTab === "Drafts" && (
                        <div>
                            <DraftsTable />
                        </div>
                    )}
                    {activeTab === "Sent" && (
                        <div>
                            <SentTable />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParticipantPage;
