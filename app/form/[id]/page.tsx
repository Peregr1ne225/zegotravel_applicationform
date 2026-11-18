"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

interface FormRecord {
	id: string | number;
	created_at?: string;
	name?: string;
	nickname?: string;
	position?: string;
	expected_salary?: number | string;
	home_type?: string;
	address?: string;
	moo?: number | string;
	road?: string;
	district?: string;
	amphur?: string;
	province?: string;
	postal?: number | string;
	phone?: string;
	email?: string;
	line_id?: string;
	ig_id?: string;
	facebook?: string;
	dateofbirth?: string;
	day_birth?: string;
	race?: string;
	nation?: string;
	religion?: string;
	card_no?: string;
	expiration_date?: string;
	height?: number | string;
	weight?: number | string;
	military?: string;
	marital?: string;
	sex?: string;
	father_name?: string;
	father_age?: number | string;
	father_occupation?: string;
	mother_name?: string;
	mother_age?: number | string;
	mother_occupation?: string;
	spouse_name?: string;
	spouse_working_place?: string;
	spouse_position?: string;
	children?: number | string;
	children_male?: number | string;
	children_female?: number | string;
	sibling?: number | string;
	sibling_male?: number | string;
	sibling_female?: number | string;
	sibling_member?: unknown;
	education?: unknown;
	job?: unknown;
	data?: Record<string, unknown>;
	[key: string]: unknown;
}

const educationFieldLabels: Record<string, string> = {
	level: "ระดับการศึกษา",
	institution: "ชื่อสถาบันการศึกษา",
	major: "สาขาวิชา / คณะ",
	ed_from: "ปีที่เริ่ม (พ.ศ.)",
	ed_to: "ปีที่จบ (พ.ศ.)",
};

const jobFieldLabels: Record<string, string> = {
	company: "บริษัท / องค์กร",
	position: "ตำแหน่งงาน",
	work_from: "ระยะเวลาเริ่ม",
	work_to: "ถึง",
	salary: "เงินเดือน (บาท)",
	job_description: "ลักษณะงานและความรับผิดชอบ",
	resignation: "เหตุผลที่ลาออก",
};

const educationLevelLabels: Record<string, string> = {
	"High School": "มัธยมศึกษา",
	Vocational: "อาชีวศึกษา (ปวช.)",
	Diploma: "อนุปริญญา / ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)",
	"Bachelor Degree": "ปริญญาตรี",
	PostGrauate: "สูงกว่าปริญญาตรี",
	Others: "อื่น ๆ",
};

function FormDetailContent() {
	const params = useParams();
	const id = params?.id as string;

	const [record, setRecord] = useState<FormRecord | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const fetchRecord = useCallback(async () => {
		if (!id) return;
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/form?id=${encodeURIComponent(id)}`, {
				cache: "no-store",
			});
			const result = await res.json();

			if (!res.ok) {
				throw new Error(result.error || "ไม่สามารถโหลดข้อมูลใบสมัครได้");
			}

			const item = Array.isArray(result.data) ? result.data[0] : result.data;
			if (!item) {
				throw new Error("ไม่พบข้อมูลใบสมัคร");
			}
			setRecord(item);
		} catch (err) {
			setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล");
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchRecord();
	}, [fetchRecord]);

	const getVal = (fieldName: string): unknown => {
		if (!record) return undefined;
		if (
			record[fieldName] !== undefined &&
			record[fieldName] !== null &&
			record[fieldName] !== ""
		) {
			return record[fieldName];
		}
		if (record.data && typeof record.data === "object") {
			return record.data[fieldName];
		}
		return undefined;
	};

	const getString = (fieldName: string, fallback = "—"): string => {
		const val = getVal(fieldName);
		if (val === undefined || val === null || val === "") return fallback;
		return String(val);
	};

	const getNumber = (fieldName: string): number | null => {
		const val = getVal(fieldName);
		if (val === undefined || val === null || val === "") return null;
		const num = Number(val);
		return Number.isNaN(num) ? null : num;
	};

	const getArray = (fieldName: string): unknown[] => {
		const val = getVal(fieldName);
		if (Array.isArray(val)) return val;
		if (typeof val === "string") {
			try {
				const parsed = JSON.parse(val);
				if (Array.isArray(parsed)) return parsed;
			} catch {
				return [];
			}
		}
		return [];
	};

	const handleCopyLink = () => {
		if (typeof window !== "undefined") {
			navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handlePrint = () => {
		if (typeof window !== "undefined") {
			window.print();
		}
	};

	// Format Thai translations for standard enums
	const formatSex = (val: string) => {
		if (val === "Male") return "ชาย";
		if (val === "Female") return "หญิง";
		return val || "—";
	};

	const formatMilitary = (val: string) => {
		if (val === "exempted") return "ได้รับการยกเว้น";
		if (val === "served") return "ผ่านการเกณฑ์ทหารแล้ว";
		if (val === "notyet") return "ยังไม่ได้รับการเกณฑ์";
		return val || "—";
	};

	const formatMarital = (val: string) => {
		if (val === "single") return "โสด";
		if (val === "married") return "สมรส";
		if (val === "widowed") return "หม้าย";
		if (val === "seperated") return "แยกกันอยู่";
		return val || "—";
	};

	const formatHomeType = (val: string) => {
		if (val === "Parent") return "อาศัยอยู่กับบิดามารดา";
		if (val === "Own") return "บ้านของตนเอง";
		if (val === "Hired") return "บ้านเช่า";
		if (val === "Flat") return "แฟลต/คอนโด";
		return val || "ไม่ได้ระบุ";
	};

	// Calculate age from date of birth
	const dobString = getString("dateofbirth", "");
	let calculatedAge: number | null = null;
	if (dobString && !Number.isNaN(Date.parse(dobString))) {
		const dob = new Date(dobString);
		const diff = Date.now() - dob.getTime();
		calculatedAge = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
	}

	if (loading) {
		return (
			<div className="flex flex-1 items-center justify-center p-12">
				<div className="flex flex-col items-center gap-3">
					<div className="h-9 w-9 animate-spin rounded-full border-3 border-[#05a44d] border-t-transparent" />
					<p className="font-medium text-sm text-zinc-600 dark:text-zinc-400">
						กำลังโหลดข้อมูลใบสมัคร...
					</p>
				</div>
			</div>
		);
	}

	if (error || !record) {
		return (
			<div className="flex flex-1 items-center justify-center px-4 py-16">
				<div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/40 dark:bg-zinc-900">
					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
						<svg
							className="h-6 w-6"
							aria-hidden="true"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>
					<h2 className="mt-4 font-bold text-lg text-zinc-900 dark:text-zinc-100">
						ไม่พบข้อมูลใบสมัคร
					</h2>
					<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
						{error || "ไม่พบข้อมูลใบสมัครที่ระบุในระบบ"}
					</p>
					<div className="mt-6 flex justify-center gap-3">
						<Link
							href="/form"
							className="rounded-lg bg-[#05a44d] px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-[#048b41]"
						>
							← กลับหน้ารายการใบสมัคร
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const siblingMembers = getArray("sibling_member");
	const educationRecords = getArray("education");
	const jobRecords = getArray("job");

	return (
		<div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-5xl space-y-6">
				{/* Top Action & Navigation Bar (hidden on print) */}
				<div className="no-print flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
						<Link
							href="/form"
							className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
						>
							รายการใบสมัคร
						</Link>
						<span>/</span>
						<span className="font-medium text-zinc-900 dark:text-zinc-100">
							{getString("name", "รายละเอียดผู้สมัคร")}
						</span>
					</div>

					<div className="flex flex-wrap items-center gap-2.5">
						<button
							type="button"
							onClick={handleCopyLink}
							className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 font-medium text-xs text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
						>
							{copied ? (
								<>
									<svg
										className="h-3.5 w-3.5 text-green-600"
										aria-hidden="true"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									คัดลอกแล้ว!
								</>
							) : (
								<>
									<svg
										className="h-3.5 w-3.5 text-zinc-500"
										aria-hidden="true"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
										/>
									</svg>
									คัดลอกลิงก์
								</>
							)}
						</button>

						<button
							type="button"
							onClick={handlePrint}
							className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 font-medium text-xs text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
						>
							<svg
								className="h-3.5 w-3.5 text-zinc-500"
								aria-hidden="true"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
								/>
							</svg>
							พิมพ์ / บันทึก PDF
						</button>

						<Link
							href="/form"
							className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 font-medium text-xs text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
						>
							← กลับหน้ารายการ
						</Link>
					</div>
				</div>

				{/* ======================================================== */}
				{/* กลุ่มที่ 1: ข้อมูลผู้สมัคร (Hero Banner Card)             */}
				{/* ======================================================== */}
				<div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
					<div className="bg-gradient-to-r from-[#04843d] via-[#05a44d] to-[#06b856] px-6 py-6 text-white sm:px-8">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<div className="flex flex-wrap items-center gap-2.5">
									<h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
										{getString("name", "ผู้สมัคร")}
									</h1>
									{getString("nickname", "") && (
										<span className="rounded-full bg-white/20 px-3 py-0.5 font-semibold text-xs tracking-wide backdrop-blur-xs">
											({getString("nickname")})
										</span>
									)}
								</div>
								<div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/90">
									<div className="flex items-center gap-1.5 font-medium">
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
												d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
										<span>
											ตำแหน่งที่ต้องการ: {getString("position", "ไม่ได้ระบุ")}
										</span>
									</div>
									<span className="opacity-50">•</span>
									<span className="font-mono text-white/80 text-xs">
										เลขที่: {String(record.id)}
									</span>
								</div>
							</div>

							{/* เงินเดือนที่คาดหวัง */}
							<div className="flex flex-col items-start sm:items-end">
								<span className="font-medium text-white/80 text-xs uppercase tracking-wider">
									เงินเดือนที่คาดหวัง
								</span>
								<div className="mt-1 inline-flex items-baseline gap-1 rounded-xl bg-white/15 px-4 py-2 font-bold text-white text-xl shadow-inner backdrop-blur-sm sm:text-2xl">
									<span>
										{getNumber("expected_salary") !== null
											? `฿${Number(getNumber("expected_salary")).toLocaleString()}`
											: getString("expected_salary", "—")}
									</span>
									<span className="font-normal text-white/80 text-xs">
										บาท / เดือน
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Quick meta footer */}
					<div className="flex flex-wrap items-center justify-between gap-4 border-zinc-100 border-t bg-zinc-50/50 px-6 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400 sm:px-8">
						<div className="flex items-center gap-2">
							<span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
							<span>ข้อมูลแบบฟอร์มสมัครงาน</span>
						</div>
						{record.created_at && (
							<div>
								ส่งใบสมัครเมื่อ{" "}
								{new Date(record.created_at).toLocaleString("th-TH", {
									dateStyle: "medium",
									timeStyle: "short",
								})}
							</div>
						)}
					</div>
				</div>

				{/* ======================================================== */}
				{/* กลุ่มที่ 2: ที่อยู่ปัจจุบัน                              */}
				{/* ======================================================== */}
				<div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
					<div className="mb-5 flex items-center justify-between border-zinc-100 border-b pb-3 dark:border-zinc-800">
						<div className="flex items-center gap-2.5">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#05a44d] dark:bg-emerald-950/50">
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
										d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
									/>
								</svg>
							</div>
							<h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
								ที่อยู่ปัจจุบัน
							</h2>
						</div>

						{/* ประเภทที่อยู่อาศัย */}
						<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-800 text-xs dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
							<span className="font-bold text-[10px] uppercase tracking-wider opacity-70">
								ที่อยู่อาศัย:
							</span>
							{formatHomeType(getString("home_type", ""))}
						</span>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<div className="sm:col-span-2">
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								เลขที่
							</span>
							<p className="mt-1 font-medium text-sm text-zinc-900 dark:text-zinc-100">
								{getString("address")}
							</p>
						</div>
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								หมู่ที่
							</span>
							<p className="mt-1 font-medium text-sm text-zinc-900 dark:text-zinc-100">
								{getString("moo")}
							</p>
						</div>
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								ถนน
							</span>
							<p className="mt-1 font-medium text-sm text-zinc-900 dark:text-zinc-100">
								{getString("road")}
							</p>
						</div>
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								ตำบล/แขวง
							</span>
							<p className="mt-1 font-medium text-sm text-zinc-900 dark:text-zinc-100">
								{getString("district")}
							</p>
						</div>
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								อำเภอ/เขต
							</span>
							<p className="mt-1 font-medium text-sm text-zinc-900 dark:text-zinc-100">
								{getString("amphur")}
							</p>
						</div>
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								จังหวัด
							</span>
							<p className="mt-1 font-medium text-sm text-zinc-900 dark:text-zinc-100">
								{getString("province")}
							</p>
						</div>
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								รหัสไปรษณีย์
							</span>
							<p className="mt-1 font-medium font-mono text-sm text-zinc-900 dark:text-zinc-100">
								{getString("postal")}
							</p>
						</div>
					</div>
				</div>

				{/* ======================================================== */}
				{/* กลุ่มที่ 3: การติดต่อ                                     */}
				{/* ======================================================== */}
				<div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
					<div className="mb-5 flex items-center gap-2.5 border-zinc-100 border-b pb-3 dark:border-zinc-800">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#05a44d] dark:bg-emerald-950/50">
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
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
						</div>
						<h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
							การติดต่อ
						</h2>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{/* โทรศัพท์ */}
						<div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40">
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-[#05a44d] dark:bg-emerald-950/80">
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
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
							</div>
							<div className="flex-1 overflow-hidden">
								<span className="font-medium text-[11px] text-zinc-400 uppercase">
									โทรศัพท์
								</span>
								<p className="truncate font-semibold text-sm text-zinc-900 dark:text-zinc-100">
									{getString("phone") !== "—" ? (
										<a
											href={`tel:${getString("phone")}`}
											className="hover:underline"
										>
											{getString("phone")}
										</a>
									) : (
										"—"
									)}
								</p>
							</div>
						</div>

						{/* อีเมล */}
						<div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40">
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400">
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
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<div className="flex-1 overflow-hidden">
								<span className="font-medium text-[11px] text-zinc-400 uppercase">
									อีเมล
								</span>
								<p className="truncate font-semibold text-sm text-zinc-900 dark:text-zinc-100">
									{getString("email") !== "—" ? (
										<a
											href={`mailto:${getString("email")}`}
											className="hover:underline"
										>
											{getString("email")}
										</a>
									) : (
										"—"
									)}
								</p>
							</div>
						</div>

						{/* Line ID */}
						<div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40">
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500 font-bold text-white text-xs">
								LINE
							</div>
							<div className="flex-1 overflow-hidden">
								<span className="font-medium text-[11px] text-zinc-400 uppercase">
									Line ID
								</span>
								<p className="truncate font-mono font-semibold text-sm text-zinc-900 dark:text-zinc-100">
									{getString("line_id")}
								</p>
							</div>
						</div>

						{/* IG */}
						<div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40">
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-100 font-bold text-pink-600 text-xs dark:bg-pink-950/80 dark:text-pink-400">
								IG
							</div>
							<div className="flex-1 overflow-hidden">
								<span className="font-medium text-[11px] text-zinc-400 uppercase">
									IG
								</span>
								<p className="truncate font-semibold text-sm text-zinc-900 dark:text-zinc-100">
									{getString("ig_id")}
								</p>
							</div>
						</div>

						{/* Facebook */}
						<div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40 sm:col-span-2 lg:col-span-2">
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 font-bold text-indigo-600 text-xs dark:bg-indigo-950/80 dark:text-indigo-400">
								FB
							</div>
							<div className="flex-1 overflow-hidden">
								<span className="font-medium text-[11px] text-zinc-400 uppercase">
									Facebook
								</span>
								<p className="truncate font-semibold text-sm text-zinc-900 dark:text-zinc-100">
									{getString("facebook")}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* ======================================================== */}
				{/* กลุ่มที่ 4: ข้อมูลส่วนบุคคล                              */}
				{/* ======================================================== */}
				<div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
					<div className="mb-5 flex items-center gap-2.5 border-zinc-100 border-b pb-3 dark:border-zinc-800">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#05a44d] dark:bg-emerald-950/50">
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
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
						</div>
						<h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
							ข้อมูลส่วนบุคคล
						</h2>
					</div>

					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{/* วัน เดือน ปี เกิด */}
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								วัน เดือน ปี เกิด
							</span>
							<p className="mt-1 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
								{getString("dateofbirth")}
								{calculatedAge !== null && (
									<span className="ml-1.5 font-normal text-xs text-zinc-500">
										({calculatedAge} ปี)
									</span>
								)}
							</p>
						</div>

						{/* เพศ */}
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								เพศ
							</span>
							<p className="mt-1 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
								{formatSex(getString("sex", ""))}
							</p>
						</div>

						{/* เชื้อชาติ */}
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								เชื้อชาติ
							</span>
							<p className="mt-1 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
								{getString("race")}
							</p>
						</div>

						{/* สัญชาติ */}
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								สัญชาติ
							</span>
							<p className="mt-1 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
								{getString("nation")}
							</p>
						</div>

						{/* ศาสนา */}
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								ศาสนา
							</span>
							<p className="mt-1 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
								{getString("religion")}
							</p>
						</div>

						{/* บัตรประชาชนเลขที่ */}
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								บัตรประชาชนเลขที่
							</span>
							<p className="mt-1 font-mono font-semibold text-sm text-zinc-900 dark:text-zinc-100">
								{getString("card_no")}
							</p>
						</div>

						{/* บัตรหมดอายุ */}
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								บัตรหมดอายุ
							</span>
							<p className="mt-1 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
								{getString("expiration_date")}
							</p>
						</div>

						{/* ส่วนสูง & น้ำหนัก */}
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								ส่วนสูง & น้ำหนัก
							</span>
							<p className="mt-1 font-semibold text-sm text-zinc-900 dark:text-zinc-100">
								{getString("height")} ซม. / {getString("weight")} กก.
							</p>
						</div>

						{/* ภาวะทางทหาร */}
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								ภาวะทางทหาร
							</span>
							<div className="mt-1">
								<span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 font-medium text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
									{formatMilitary(getString("military", ""))}
								</span>
							</div>
						</div>

						{/* สถานภาพ */}
						<div>
							<span className="font-medium text-xs text-zinc-400 uppercase tracking-wider">
								สถานภาพ
							</span>
							<div className="mt-1">
								<span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 font-medium text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
									{formatMarital(getString("marital", ""))}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* ======================================================== */}
				{/* กลุ่มที่ 5: ประวัติครอบครัว                              */}
				{/* ======================================================== */}
				<div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
					<div className="mb-5 flex items-center gap-2.5 border-zinc-100 border-b pb-3 dark:border-zinc-800">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#05a44d] dark:bg-emerald-950/50">
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
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
							ประวัติครอบครัว
						</h2>
					</div>

					<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
						{/* ข้อมูลบิดา */}
						<div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
							<div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
								<span className="font-bold text-[#05a44d] text-xs uppercase tracking-wider">
									บิดา
								</span>
							</div>
							<h3 className="mt-2 font-semibold text-base text-zinc-900 dark:text-zinc-100">
								{getString("father_name")}
							</h3>
							<div className="mt-2 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
								<p>
									<span className="font-medium text-zinc-400">อายุ:</span>{" "}
									{getString("father_age")}{" "}
									{getString("father_age") !== "—" ? "ปี" : ""}
								</p>
								<p>
									<span className="font-medium text-zinc-400">อาชีพ:</span>{" "}
									{getString("father_occupation")}
								</p>
							</div>
						</div>

						{/* ข้อมูลมารดา */}
						<div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
							<div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
								<span className="font-bold text-[#05a44d] text-xs uppercase tracking-wider">
									มารดา
								</span>
							</div>
							<h3 className="mt-2 font-semibold text-base text-zinc-900 dark:text-zinc-100">
								{getString("mother_name")}
							</h3>
							<div className="mt-2 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
								<p>
									<span className="font-medium text-zinc-400">อายุ:</span>{" "}
									{getString("mother_age")}{" "}
									{getString("mother_age") !== "—" ? "ปี" : ""}
								</p>
								<p>
									<span className="font-medium text-zinc-400">อาชีพ:</span>{" "}
									{getString("mother_occupation")}
								</p>
							</div>
						</div>

						{/* ข้อมูลคู่สมรส */}
						<div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
							<div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
								<span className="font-bold text-[#05a44d] text-xs uppercase tracking-wider">
									คู่สมรส
								</span>
							</div>
							<h3 className="mt-2 font-semibold text-base text-zinc-900 dark:text-zinc-100">
								{getString("spouse_name")}
							</h3>
							<div className="mt-2 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
								<p>
									<span className="font-medium text-zinc-400">สถานที่ทำงาน:</span>{" "}
									{getString("spouse_working_place")}
								</p>
								<p>
									<span className="font-medium text-zinc-400">ตำแหน่ง:</span>{" "}
									{getString("spouse_position")}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* ======================================================== */}
				{/* กลุ่มที่ 6: ประวัติพี่น้องและบุตร                        */}
				{/* ======================================================== */}
				<div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
					<div className="mb-5 flex items-center gap-2.5 border-zinc-100 border-b pb-3 dark:border-zinc-800">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#05a44d] dark:bg-emerald-950/50">
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
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
						</div>
						<h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
							ประวัติพี่น้องและบุตร
						</h2>
					</div>

					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
						{/* ข้อมูลบุตร */}
						<div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
							<span className="font-semibold text-xs text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
								ข้อมูลบุตร
							</span>
							<div className="mt-3 flex items-baseline gap-2">
								<span className="font-bold text-2xl text-zinc-900 dark:text-zinc-100">
									{getString("children", "0")}
								</span>
								<span className="text-xs text-zinc-500">คน</span>
							</div>
							<div className="mt-3 flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
								<div>
									<span className="font-medium text-zinc-400">ชาย:</span>{" "}
									<span className="font-semibold text-zinc-900 dark:text-zinc-100">
										{getString("children_male", "0")}
									</span>{" "}
									คน
								</div>
								<div>
									<span className="font-medium text-zinc-400">หญิง:</span>{" "}
									<span className="font-semibold text-zinc-900 dark:text-zinc-100">
										{getString("children_female", "0")}
									</span>{" "}
									คน
								</div>
							</div>
						</div>

						{/* ข้อมูลพี่น้อง */}
						<div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
							<span className="font-semibold text-xs text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
								มีพี่น้อง (รวมผู้สมัคร)
							</span>
							<div className="mt-3 flex items-baseline gap-2">
								<span className="font-bold text-2xl text-zinc-900 dark:text-zinc-100">
									{getString("sibling", "0")}
								</span>
								<span className="text-xs text-zinc-500">คน</span>
							</div>
							<div className="mt-3 flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
								<div>
									<span className="font-medium text-zinc-400">ชาย:</span>{" "}
									<span className="font-semibold text-zinc-900 dark:text-zinc-100">
										{getString("sibling_male", "0")}
									</span>{" "}
									คน
								</div>
								<div>
									<span className="font-medium text-zinc-400">หญิง:</span>{" "}
									<span className="font-semibold text-zinc-900 dark:text-zinc-100">
										{getString("sibling_female", "0")}
									</span>{" "}
									คน
								</div>
							</div>
						</div>
					</div>

					{/* รายละเอียดพี่น้อง */}
					<div className="mt-5 border-zinc-100 border-t pt-4 dark:border-zinc-800">
						<div className="mb-3 flex items-center justify-between">
							<span className="font-semibold text-xs text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
								รายละเอียดพี่น้องแต่ละคน
							</span>
							<span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-[11px] text-[#05a44d] dark:bg-emerald-950/50">
								{siblingMembers.length} คน
							</span>
						</div>

						{siblingMembers.length > 0 ? (
							<div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
								<table className="min-w-full divide-y divide-zinc-200 text-left text-xs dark:divide-zinc-800">
									<thead className="bg-zinc-50/80 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300">
										<tr>
											<th className="w-16 px-4 py-3 text-center font-semibold">
												ลำดับ
											</th>
											<th className="px-4 py-3 font-semibold">ชื่อ-นามสกุล</th>
											<th className="px-4 py-3 font-semibold">อายุ</th>
											<th className="px-4 py-3 font-semibold">อาชีพ</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
										{siblingMembers.map((member, idx) => {
											const isObj =
												typeof member === "object" && member !== null;
											const m = isObj
												? (member as Record<string, unknown>)
												: null;
											const itemKey = isObj
												? ((m?._id as string | undefined) ??
													JSON.stringify(member))
												: String(member);
											return (
												<tr
													key={itemKey}
													className="transition hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40"
												>
													<td className="px-4 py-3 text-center font-semibold text-zinc-500 dark:text-zinc-400">
														#{idx + 1}
													</td>
													<td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
														{m ? String(m.name || "—") : String(member)}
													</td>
													<td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
														{m?.age ? `${String(m.age)} ปี` : "—"}
													</td>
													<td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
														{m ? String(m.occupation || "—") : "—"}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						) : (
							<p className="mt-2 text-xs text-zinc-400 italic">
								ไม่มีรายละเอียดพี่น้องเพิ่มเติม
							</p>
						)}
					</div>
				</div>

				{/* ======================================================== */}
				{/* กลุ่มที่ 7: ประวัติการศึกษา                                */}
				{/* ======================================================== */}
				<div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
					<div className="mb-5 flex items-center justify-between border-zinc-100 border-b pb-3 dark:border-zinc-800">
						<div className="flex items-center gap-2.5">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#05a44d] dark:bg-emerald-950/50">
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
										d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
									/>
								</svg>
							</div>
							<h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
								ประวัติการศึกษา
							</h2>
						</div>

						<span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-xs text-[#05a44d] dark:bg-emerald-950/50">
							{educationRecords.length} รายการ
						</span>
					</div>

					{educationRecords.length > 0 ? (
						<div className="space-y-3">
							{educationRecords.map((item, index) => {
								const isObj = typeof item === "object" && item !== null;
								const recordObj = isObj
									? (item as Record<string, unknown>)
									: null;
								const levelVal = recordObj ? String(recordObj.level ?? "") : "";
								const displayLevel = educationLevelLabels[levelVal] ?? levelVal;
								const itemKey = isObj
									? ((recordObj?._id as string | undefined) ??
										JSON.stringify(item))
									: String(item);
								return (
									<div
										key={itemKey}
										className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40"
									>
										{recordObj ? (
											<div>
												<div className="mb-2 flex items-center justify-between border-zinc-200/50 border-b pb-2 dark:border-zinc-700/50">
													<div className="flex items-center gap-2">
														<span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#05a44d] font-bold text-[10px] text-white">
															{index + 1}
														</span>
														<span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
															{displayLevel || `รายการที่ #${index + 1}`}
														</span>
													</div>
													{Boolean(recordObj.ed_from || recordObj.ed_to) && (
														<span className="font-medium text-xs text-zinc-500 dark:text-zinc-400">
															พ.ศ. {String(recordObj.ed_from || "—")} -{" "}
															{String(recordObj.ed_to || "—")}
														</span>
													)}
												</div>
												<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
													{Object.entries(recordObj)
														.filter(([k]) => k !== "_id")
														.map(([k, v]) => (
															<div key={k}>
																<span className="font-semibold text-[10px] text-zinc-400 uppercase">
																	{educationFieldLabels[k] ?? k}
																</span>
																<p className="font-medium text-xs text-zinc-800 dark:text-zinc-200">
																	{k === "level"
																		? displayLevel
																		: String(v || "—")}
																</p>
															</div>
														))}
												</div>
											</div>
										) : (
											<p className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
												{String(item)}
											</p>
										)}
									</div>
								);
							})}
						</div>
					) : (
						<p className="text-xs text-zinc-400 italic">ไม่มีข้อมูลประวัติการศึกษา</p>
					)}
				</div>

				{/* ======================================================== */}
				{/* กลุ่มที่ 8: ประวัติการทำงาน                                */}
				{/* ======================================================== */}
				<div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
					<div className="mb-5 flex items-center justify-between border-zinc-100 border-b pb-3 dark:border-zinc-800">
						<div className="flex items-center gap-2.5">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#05a44d] dark:bg-emerald-950/50">
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
										d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
								ประวัติการทำงาน
							</h2>
						</div>

						<span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-xs text-[#05a44d] dark:bg-emerald-950/50">
							{jobRecords.length} รายการ
						</span>
					</div>

					{jobRecords.length > 0 ? (
						<div className="space-y-3">
							{jobRecords.map((item, index) => {
								const isObj = typeof item === "object" && item !== null;
								const recordObj = isObj
									? (item as Record<string, unknown>)
									: null;
								const itemKey = isObj
									? ((recordObj?._id as string | undefined) ??
										JSON.stringify(item))
									: String(item);
								return (
									<div
										key={itemKey}
										className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40"
									>
										{recordObj ? (
											<div>
												<div className="mb-2 flex items-center justify-between border-zinc-200/50 border-b pb-2 dark:border-zinc-700/50">
													<div className="flex items-center gap-2">
														<span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#05a44d] font-bold text-[10px] text-white">
															{index + 1}
														</span>
														<span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
															{String(
																recordObj.company || `ที่ทำงานที่ #${index + 1}`,
															)}
														</span>
														{Boolean(recordObj.position) && (
															<span className="text-xs text-zinc-500 dark:text-zinc-400">
																({String(recordObj.position)})
															</span>
														)}
													</div>
														{Boolean(recordObj.work_from || recordObj.work_to) && (
														<span className="font-medium text-xs text-zinc-500 dark:text-zinc-400">
															{String(recordObj.work_from || "—")} -{" "}
															{String(recordObj.work_to || "—")}
														</span>
													)}
												</div>
												<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
													{Object.entries(recordObj)
														.filter(([k]) => k !== "_id")
														.map(([k, v]) => (
															<div
																key={k}
																className={
																	k === "job_description" || k === "resignation"
																		? "sm:col-span-2 lg:col-span-3"
																		: ""
																}
															>
																<span className="font-semibold text-[10px] text-zinc-400 uppercase">
																	{jobFieldLabels[k] ?? k}
																</span>
																<p className="font-medium text-xs text-zinc-800 dark:text-zinc-200">
																	{k === "salary" && v
																		? `${Number(v).toLocaleString()} บาท`
																		: String(v || "—")}
																</p>
															</div>
														))}
												</div>
											</div>
										) : (
											<p className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
												{String(item)}
											</p>
										)}
									</div>
								);
							})}
						</div>
					) : (
						<p className="text-xs text-zinc-400 italic">ไม่มีข้อมูลประวัติการทำงาน</p>
					)}
				</div>

				{/* Bottom Navigation (hidden on print) */}
				<div className="no-print flex items-center justify-between pt-4">
					<Link
						href="/form"
						className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 font-medium text-sm text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
					>
						← กลับหน้ารายการใบสมัครทั้งหมด
					</Link>
					<button
						type="button"
						onClick={handlePrint}
						className="inline-flex items-center gap-2 rounded-lg bg-[#05a44d] px-5 py-2 font-medium text-sm text-white shadow-sm hover:bg-[#048b41]"
					>
						พิมพ์ใบสมัครงาน
					</button>
				</div>
			</div>
		</div>
	);
}

export default function FormDetailPage() {
	return (
		<Suspense
			fallback={
				<div className="flex flex-1 items-center justify-center p-12">
					<div className="flex flex-col items-center gap-3">
						<div className="h-9 w-9 animate-spin rounded-full border-3 border-[#05a44d] border-t-transparent" />
						<p className="font-medium text-sm text-zinc-600 dark:text-zinc-400">
							กำลังโหลดข้อมูลใบสมัคร...
						</p>
					</div>
				</div>
			}
		>
			<FormDetailContent />
		</Suspense>
	);
}
