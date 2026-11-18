"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";

function NavbarContent() {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navItems = [
		{
			label: "แบบฟอร์มสมัครงาน",
			href: "/",
			description: "กรอกและส่งใบสมัคร",
			icon: (
				<svg
					className="h-4 w-4"
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			),
		},
		{
			label: "ดูใบสมัครทั้งหมด",
			href: "/form",
			description: "รายการข้อมูลผู้สมัคร",
			icon: (
				<svg
					className="h-4 w-4"
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 10h18M3 14h18m-9-4v8m-7 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			),
		},
	];

	return (
		<header className="no-print sticky top-0 z-50 w-full bg-gradient-to-r from-[#04843d] via-[#05a44d] to-[#06b856] text-white shadow-[0_4px_25px_-5px_rgba(5,164,77,0.35)] backdrop-blur-md">
			{/* Top subtle highlight border line */}
			<div className="h-[1px] w-full bg-white/25" />

			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
				{/* Brand Group */}
				<Link
					href="/"
					className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.01]"
				>
					<div className="relative flex h-9 w-auto items-center justify-center rounded-lg bg-white/10 px-2 py-1 shadow-inner backdrop-blur-sm transition group-hover:bg-white/15">
						<Image
							src="/images/zego-logo-w.png"
							alt="โลโก้ Zego"
							width={110}
							height={30}
							className="h-6 w-auto object-contain drop-shadow-sm"
							priority
						/>
					</div>

					<div className="hidden h-5 w-px bg-white/25 sm:block" />

					<div className="flex flex-col">
						<div className="flex items-center gap-1.5">
							<span className="font-bold text-base tracking-tight text-white drop-shadow-xs sm:text-lg">
								ระบบรับสมัครงาน
							</span>
							<span className="rounded-full bg-white/20 px-1.5 py-0.5 font-medium text-[10px] tracking-wide text-white uppercase backdrop-blur-xs">
								พอร์ทัล
							</span>
						</div>
					</div>
				</Link>

				{/* Desktop Segmented Navigation */}
				<nav className="hidden items-center gap-1 rounded-full border border-white/20 bg-black/15 p-1 shadow-inner backdrop-blur-md sm:flex">
					{navItems.map((item) => {
						const isActive =
							item.href === "/"
								? pathname === "/"
								: pathname?.startsWith(item.href);
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-medium text-xs tracking-wide transition-all duration-200 ${
									isActive
										? "bg-white text-[#04843d] font-semibold shadow-md ring-1 ring-black/5"
										: "text-white/85 hover:bg-white/15 hover:text-white"
								}`}
							>
								<span className={isActive ? "text-[#04843d]" : "text-white/80"}>
									{item.icon}
								</span>
								<span>{item.label}</span>
							</Link>
						);
					})}
				</nav>

				{/* Mobile Hamburger Menu Button */}
				<button
					type="button"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 p-2 text-white shadow-sm transition hover:bg-white/20 active:scale-95 sm:hidden"
					aria-label="เปิด/ปิดเมนูการนำทาง"
					aria-expanded={isMobileMenuOpen}
				>
					<svg
						className="h-5 w-5"
						aria-hidden="true"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						{isMobileMenuOpen ? (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						) : (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						)}
					</svg>
				</button>
			</div>

			{/* Mobile Dropdown Menu */}
			{isMobileMenuOpen && (
				<div className="border-t border-white/15 bg-[#04843d]/95 px-4 py-4 shadow-xl backdrop-blur-xl sm:hidden">
					<div className="flex flex-col gap-2">
						{navItems.map((item) => {
							const isActive =
								item.href === "/"
									? pathname === "/"
									: pathname?.startsWith(item.href);
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setIsMobileMenuOpen(false)}
									className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
										isActive
											? "bg-white text-[#04843d] font-semibold shadow-md"
											: "bg-white/10 text-white hover:bg-white/15"
									}`}
								>
									<div
										className={`flex h-8 w-8 items-center justify-center rounded-lg ${
											isActive
												? "bg-[#05a44d]/15 text-[#04843d]"
												: "bg-white/15 text-white"
										}`}
									>
										{item.icon}
									</div>
									<div className="flex flex-col">
										<span className="font-medium">{item.label}</span>
										<span
											className={`text-xs ${
												isActive ? "text-[#04843d]/80" : "text-white/70"
											}`}
										>
											{item.description}
										</span>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			)}
		</header>
	);
}

export default function Navbar() {
	return (
		<Suspense
			fallback={
				<header className="no-print sticky top-0 z-50 h-16 w-full bg-gradient-to-r from-[#04843d] via-[#05a44d] to-[#06b856] shadow-[0_4px_25px_-5px_rgba(5,164,77,0.35)]" />
			}
		>
			<NavbarContent />
		</Suspense>
	);
}
