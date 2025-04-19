import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useSessionStore } from "../stores/authStore"; // adjust path as needed
import { LoaderSpinner } from "../components/LoaderSpinner";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export const PrivateLayout = () => {
	const accessToken = useSessionStore((state) => state.accessToken);
	const navigate = useNavigate();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	useEffect(() => {
		if (!accessToken) {
			navigate("/login", { replace: true });
		}
	}, [accessToken, navigate]);

	if (!accessToken) return <LoaderSpinner />;

	return (
		<div id="page-container" className="mx-auto flex min-h-screen w-full min-w-[320px] flex-col bg-slate-100 lg:ps-64">
			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<Header onOpenSidebar={() => setSidebarOpen(true)} />
			<main id="page-content" className="flex flex-auto flex-col pt-20 lg:pt-0">
				<Outlet />
			</main>
		</div>
	);
};
