import React from "react";

interface HeaderProps {
	onOpenSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => (
	<header className="fixed start-0 end-0 top-0 z-30 flex h-20 flex-none items-center bg-white shadow-xs lg:hidden">
		<div className="flex w-full justify-between px-4 lg:px-8">
			{/* Brand */}
			<a
				href="#"
				className="inline-flex items-center gap-2 text-lg font-bold tracking-wide text-slate-800 hover:opacity-75 active:opacity-100"
			>
				<div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
					{/* SVG icon */}
					{/* ... */}
				</div>
				<span>
					Tail<span className="text-blue-600">Project</span>
				</span>
			</a>
			{/* Toggle Sidebar on Mobile */}
			<button
				type="button"
				className="inline-flex size-10 items-center justify-center rounded-lg bg-slate-100 leading-6 font-semibold text-slate-800 hover:bg-slate-200"
				onClick={onOpenSidebar}
			>
				<svg
					className="hi-solid hi-menu-alt-1 inline-block size-5"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fillRule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
		</div>
	</header>
);

export default Header;
