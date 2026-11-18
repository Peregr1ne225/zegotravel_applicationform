import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "ระบบรับสมัครงาน",
	description: "กรอกใบสมัครและจัดการรายการผู้สมัคร",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="th"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
				<Suspense
					fallback={
						<header className="no-print sticky top-0 z-50 h-16 w-full bg-gradient-to-r from-[#04843d] via-[#05a44d] to-[#06b856] shadow-[0_4px_25px_-5px_rgba(5,164,77,0.35)]" />
					}
				>
					<Navbar />
				</Suspense>
				<main className="flex-1 flex flex-col">{children}</main>
			</body>
		</html>
	);
}
