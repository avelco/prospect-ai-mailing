// Navbar.tsx
import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { useSessionStore } from "../stores/authStore";

const menuOptions = [
	{ name: "Mailing", href: "mailing" },
	{ name: "Prospectos", href: "prospects" },
	{ name: "Tratos", href: "deals" },
];

const userMenu = [
	{ name: "Settings", href: "settings" },
	{ name: "Logout", href: "logout" },
];

const defaultAvatar =
	"https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff";

export const Navbar: React.FC = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const userMenuRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	// Close user menu on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target as Node)
			) {
				setUserMenuOpen(false);
			}
		}
		if (userMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [userMenuOpen]);

	return (
		<nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
			{/* Logo */}
			<div className="flex items-center gap-2">
				<FaRobot className="text-blue-600 text-2xl" />
				<span className="font-bold text-xl text-gray-800">ProspectAI</span>
			</div>

			{/* Desktop Menu */}
			<div className="hidden md:flex gap-6">
				{menuOptions.map((option) => (
					<a
						key={option.name}
						href={option.href}
						className="text-gray-700 hover:text-blue-600 font-medium"
					>
						{option.name}
					</a>
				))}
			</div>

			{/* User Avatar & Dropdown */}
			<div className="relative" ref={userMenuRef}>
				<img
					src={defaultAvatar}
					alt="User"
					className="w-9 h-9 rounded-full cursor-pointer border-2 border-gray-200"
					onClick={() => setUserMenuOpen((open) => !open)}
				/>
				{userMenuOpen && (
					<div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-20">
						<Link
							to="settings"
							className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
						>
							Settings
						</Link>
						<div
							className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
							onClick={() => {useSessionStore.getState().clearSession(); navigate("/login"); }}
						>
							Logout
						</div>
					</div>
				)}
			</div>

			{/* Hamburger for Mobile */}
			<button
				className="md:hidden ml-2 text-gray-700"
				onClick={() => setMenuOpen((open) => !open)}
				aria-label="Open menu"
			>
				<FaBars className="text-2xl" />
			</button>

			{/* Mobile Menu */}
			{menuOpen && (
				<div className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 flex flex-col md:hidden z-10">
					{menuOptions.map((option) => (
						<a
							key={option.name}
							href={option.href}
							className="px-6 py-3 text-gray-700 hover:bg-gray-100"
							onClick={() => setMenuOpen(false)}
						>
							{option.name}
						</a>
					))}
				</div>
			)}
		</nav>
	);
};

export default Navbar;
