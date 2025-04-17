// SettingsPage.tsx
import UploadSuspects from "../components/UploadSuspects"
import React, { useState } from "react";
import { FaUpload, FaUsers } from "react-icons/fa";

const TABS = [
  { key: "suspects", label: "Cargar Suspects", icon: <FaUpload /> },
  { key: "usuarios", label: "Usuarios", icon: <FaUsers /> },
];

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("suspects");

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Configuración</h1>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`flex items-center gap-2 px-6 py-3 -mb-px border-b-2 font-medium transition
              ${
                activeTab === tab.key
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
        {activeTab === "suspects" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Cargar Suspects</h2>
            <UploadSuspects />
          </div>
        )}
        {activeTab === "usuarios" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Usuarios</h2>
            <div className="text-gray-600">
              {/* Replace this with your user management UI */}
              <p>Gestión de usuarios próximamente...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
