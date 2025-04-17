// SettingsPage.tsx
import UploadSuspects from "../components/UploadSuspects"
import React, { useState } from "react";
import { FaUpload, FaUsers } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { MdOutlineCampaign } from "react-icons/md";
import Products from "../components/ProductForm";
import Campaigns from "../components/CampaignForm";
import ProductForm from "../components/ProductForm";
import { ProductTable } from "../components/ProductTable";
import CampaignForm from "../components/CampaignForm";
import { CampaignTable } from "../components/CampaignTable";

const TABS = [
	{ key: "Suspects", label: "Cargar Suspects", icon: <FaUpload /> },
	{ key: "Users", label: "Usuarios", icon: <FaUsers /> },
	{ key: "Products", label: "Productos", icon: <AiFillProduct /> },
	{ key: "Campaigns", label: "Campañas", icon: <MdOutlineCampaign /> },
];

const SettingsPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState<string>("Suspects");

	return (
		<div className="max-w-3xl mx-auto mt-12 bg-white rounded-xl shadow-lg p-8">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">Configuración</h1>
			{/* Tabs */}
			<div className="flex border-b border-gray-200 mb-8">
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
				{activeTab === "Suspects" && (
					<div>
						<h2 className="text-lg font-semibold mb-4">Cargar Suspects</h2>
						<UploadSuspects />
					</div>
				)}
				{activeTab === "Users" && (
					<div>
						<h2 className="text-lg font-semibold mb-4">Usuarios</h2>
						<div className="text-gray-600">
							{/* Replace this with your user management UI */}
							<p>Gestión de usuarios próximamente...</p>
						</div>
					</div>
				)}
				{activeTab === "Products" && (
					<div>
						<h2 className="text-lg font-semibold mb-4">Productos</h2>
						<div className="text-gray-600">
							<ProductForm />
							<ProductTable />
						</div>
					</div>
				)}
				{activeTab === "Campaigns" && (
					<div>
						<h2 className="text-lg font-semibold mb-4">Campañas</h2>
						<div className="text-gray-600">
							<CampaignForm />
							<CampaignTable />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SettingsPage;
