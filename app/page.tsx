"use client";

import Link from "next/link";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

type FieldType =
	| "text"
	| "email"
	| "tel"
	| "date"
	| "number"
	| "enum"
	| "repeatable";
type RepeatField = {
	name: string;
	label: string;
	type?: "number" | "enum";
	options?: string[];
};
type Field = {
	name: string;
	label: string;
	type?: FieldType;
	options?: string[];
	items?: RepeatField[];
	wide?: boolean;
	unit?: string;
};

const groupIcons: Record<string, string> = {
	ข้อมูลผู้สมัคร: "👤",
	ที่อยู่ปัจจุบัน: "🏠",
	การติดต่อ: "📞",
	ข้อมูลส่วนบุคคล: "📋",
	ประวัติครอบครัว: "👨‍👩‍👧",
	ประวัติพี่น้อง: "👥",
	ประวัติการศึกษา: "🎓",
};

const groups: { title: string; subtitle: string; fields: Field[] }[] = [
	{
		title: "ข้อมูลผู้สมัคร",
		subtitle: "ระบุชื่อ ตำแหน่งงาน และเงินเดือนที่ท่านต้องการ",
		fields: [
			{ name: "name", label: "ชื่อ-นามสกุล" },
			{ name: "nickname", label: "ชื่อเล่น" },
			{
				name: "day_birth",
				label: "วันเกิดประจำสัปดาห์",
				type: "enum",
				options: [
					"Sunday",
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
				],
			},
			{ name: "position", label: "ตำแหน่งที่ต้องการสมัคร" },
			{
				name: "expected_salary",
				label: "เงินเดือนที่คาดหวัง",
				type: "number",
				unit: "บาท / เดือน",
			},
		],
	},
	{
		title: "ที่อยู่ปัจจุบัน",
		subtitle: "ข้อมูลที่พักอาศัยและสถานที่ติดต่อในปัจจุบัน",
		fields: [
			{
				name: "home_type",
				label: "ประเภทที่อยู่อาศัย",
				type: "enum",
				options: ["Parent", "Own", "Hired", "Flat"],
			},
			{ name: "address", label: "เลขที่ / อาคาร" },
			{ name: "moo", label: "หมู่ที่" },
			{ name: "road", label: "ถนน" },
			{ name: "district", label: "ตำบล / แขวง" },
			{ name: "amphur", label: "อำเภอ / เขต" },
			{ name: "province", label: "จังหวัด" },
			{ name: "postal", label: "รหัสไปรษณีย์ (5 หลัก)" },
		],
	},
	{
		title: "การติดต่อ",
		subtitle: "ช่องทางการติดต่อสื่อสารและโซเชียลมีเดีย",
		fields: [
			{ name: "phone", label: "เบอร์โทรศัพท์ (10 หลัก ขึ้นต้นด้วย 0)", type: "tel" },
			{ name: "email", label: "อีเมล", type: "email" },
			{ name: "line_id", label: "Line ID" },
			{ name: "facebook", label: "Facebook" },
			{ name: "ig_id", label: "Instagram ID" },
		],
	},
	{
		title: "ข้อมูลส่วนบุคคล",
		subtitle: "ข้อมูลประจำตัว สรีระ และสถานะทางกฎหมาย",
		fields: [
			{ name: "dateofbirth", label: "วัน เดือน ปี เกิด", type: "date" },
			{ name: "race", label: "เชื้อชาติ" },
			{ name: "nation", label: "สัญชาติ" },
			{ name: "religion", label: "ศาสนา" },
			{ name: "card_no", label: "เลขบัตรประจำตัวประชาชน (13 หลัก)", type: "tel" },
			{ name: "expiration_date", label: "วันหมดอายุบัตรประชาชน", type: "date" },
			{ name: "height", label: "ส่วนสูง", type: "number", unit: "ซม." },
			{ name: "weight", label: "น้ำหนัก", type: "number", unit: "กก." },
			{
				name: "military",
				label: "ภาวะทางทหาร",
				type: "enum",
				options: ["exempted", "served", "notyet"],
			},
			{
				name: "marital",
				label: "สถานภาพการสมรส",
				type: "enum",
				options: ["single", "married", "widowed", "seperated"],
			},
			{ name: "sex", label: "เพศ", type: "enum", options: ["Male", "Female"] },
		],
	},
	{
		title: "ประวัติครอบครัว",
		subtitle: "ข้อมูลบิดา มารดา คู่สมรส และบุตร",
		fields: [
			{ name: "father_name", label: "บิดา ชื่อ-นามสกุล", wide: true },
			{ name: "father_age", label: "อายุบิดา", type: "number", unit: "ปี" },
			{ name: "father_occupation", label: "อาชีพบิดา" },
			{ name: "mother_name", label: "มารดา ชื่อ-นามสกุล", wide: true },
			{ name: "mother_age", label: "อายุมารดา", type: "number", unit: "ปี" },
			{ name: "mother_occupation", label: "อาชีพมารดา" },
			{ name: "spouse_name", label: "ชื่อคู่สมรส (ภรรยา / สามี)" },
			{ name: "spouse_working_place", label: "สถานที่ทำงานคู่สมรส" },
			{ name: "spouse_position", label: "ตำแหน่งงานคู่สมรส" },
			{ name: "children", label: "จำนวนบุตรทั้งหมด", type: "number", unit: "คน" },
			{ name: "children_male", label: "บุตรชาย", type: "number", unit: "คน" },
			{ name: "children_female", label: "บุตรหญิง", type: "number", unit: "คน" },
		],
	},
	{
		title: "ประวัติพี่น้อง",
		subtitle: "ข้อมูลพี่น้องร่วมบิดามารดา (รวมตัวผู้สมัคร)",
		fields: [
			{
				name: "sibling",
				label: "จำนวนพี่น้องทั้งหมด (รวมตัวผู้สมัคร)",
				type: "number",
				unit: "คน",
				wide: true,
			},
			{ name: "sibling_male", label: "ชาย", type: "number", unit: "คน" },
			{ name: "sibling_female", label: "หญิง", type: "number", unit: "คน" },
			{
				name: "sibling_member",
				label: "รายละเอียดพี่น้องแต่ละคน",
				type: "repeatable",
				items: [
					{ name: "name", label: "ชื่อ-นามสกุล" },
					{ name: "age", label: "อายุ", type: "number" },
					{ name: "occupation", label: "อาชีพ" },
				],
				wide: true,
			},
		],
	},
	{
		title: "ประวัติการศึกษา",
		subtitle: "ประวัติการศึกษาและการทำงานที่ผ่านมา",
		fields: [
			{
				name: "education",
				label: "ประวัติการศึกษา",
				type: "repeatable",
				items: [
					{
						name: "level",
						label: "ระดับการศึกษา",
						type: "enum",
						options: [
							"High School",
							"Vocational",
							"Diploma",
							"Bachelor Degree",
							"PostGrauate",
							"Others",
						],
					},
					{ name: "institution", label: "ชื่อสถาบันการศึกษา" },
					{ name: "major", label: "สาขาวิชา / คณะ" },
					{ name: "ed_from", label: "ปีที่เริ่ม (พ.ศ.)" },
					{ name: "ed_to", label: "ปีที่จบ (พ.ศ.)" },
				],
				wide: true,
			},
			{
				name: "job",
				label: "ประวัติการทำงาน (เรียงจากล่าสุดไปอดีต)",
				type: "repeatable",
				items: [
					{ name: "company", label: "บริษัท / องค์กร" },
					{ name: "work_from", label: "ระยะเวลาเริ่ม เดือน ปี พ.ศ." },
					{ name: "work_to", label: "ถึง เดือน ปี พ.ศ." },
					{ name: "position", label: "ตำแหน่งงาน" },
					{ name: "job_description", label: "ลักษณะงานและความรับผิดชอบ" },
					{ name: "salary", label: "เงินเดือน (บาท)", type: "number" },
					{ name: "resignation", label: "เหตุผลที่ลาออก" },
				],
				wide: true,
			},
		],
	},
];

const enumLabels: Record<string, string> = {
	Parent: "อาศัยกับครอบครัว / บิดามารดา",
	Own: "บ้านของตนเอง",
	Hired: "บ้านเช่า",
	Flat: "หอพัก / คอนโดมิเนียม",
	Sunday: "วันอาทิตย์",
	Monday: "วันจันทร์",
	Tuesday: "วันอังคาร",
	Wednesday: "วันพุธ",
	Thursday: "วันพฤหัสบดี",
	Friday: "วันศุกร์",
	Saturday: "วันเสาร์",
	exempted: "ได้รับการยกเว้น",
	served: "ผ่านการเกณฑ์ทหารแล้ว",
	notyet: "ยังไม่ได้รับการเกณฑ์ทหาร",
	single: "โสด",
	married: "สมรส",
	widowed: "หม้าย",
	seperated: "แยกกันอยู่",
	Male: "ชาย",
	Female: "หญิง",
	"High School": "มัธยมศึกษา",
	Vocational: "อาชีวศึกษา (ปวช.)",
	Diploma: "อนุปริญญา / ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)",
	"Bachelor Degree": "ปริญญาตรี",
	PostGrauate: "สูงกว่าปริญญาตรี",
	Others: "อื่น ๆ",
};

const allFields = groups.flatMap((group) => group.fields);
const countPairs = [
	{
		total: "sibling",
		male: "sibling_male",
		female: "sibling_female",
		label: "พี่น้อง",
	},
	{
		total: "children",
		male: "children_male",
		female: "children_female",
		label: "บุตร",
	},
];

const emptyForm = (): Record<string, string> =>
	Object.fromEntries(
		allFields.map((field) => [
			field.name,
			field.type === "repeatable" ? "[]" : "",
		]),
	);

export default function Home() {
	const [formData, setFormData] = useState(emptyForm);
	const [status, setStatus] = useState<
		"idle" | "submitting" | "success" | "error"
	>("idle");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [createdId, setCreatedId] = useState<string | number | null>(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [today, setToday] = useState<string | null>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const lastScrollAt = useRef(Number.NEGATIVE_INFINITY);
	const currentGroup = groups[currentStep];
	const summaryStep = currentStep === groups.length;
	const totalSteps = groups.length + 1;

	const age =
		today && formData.dateofbirth
			? Number(today.slice(0, 4)) -
				Number(formData.dateofbirth.slice(0, 4)) -
				(today.slice(5) < formData.dateofbirth.slice(5) ? 1 : 0)
			: null;

	useEffect(() => {
		const now = new Date();
		setToday(
			`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`,
		);
		const markScroll = () => {
			lastScrollAt.current = performance.now();
		};
		window.addEventListener("scroll", markScroll, true);
		window.addEventListener("wheel", markScroll, {
			capture: true,
			passive: true,
		});
		window.addEventListener("touchmove", markScroll, {
			capture: true,
			passive: true,
		});
		return () => {
			window.removeEventListener("scroll", markScroll, true);
			window.removeEventListener("wheel", markScroll, true);
			window.removeEventListener("touchmove", markScroll, true);
		};
	}, []);

	const scrolledRecently = () => performance.now() - lastScrollAt.current < 250;

	const handleChange = (
		event: ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = event.target;
		setFormData((current) => ({ ...current, [name]: value }));
		setErrorMessage(null);
		if (status === "error") setStatus("idle");
	};

	const updateRepeatable = (
		field: Field,
		index: number,
		key: string,
		value: string,
	) => {
		setFormData((current) => {
			const rows = JSON.parse(current[field.name]) as Record<string, string>[];
			rows[index] = { ...rows[index], [key]: value };
			return { ...current, [field.name]: JSON.stringify(rows) };
		});
	};

	const addRepeatable = (field: Field) => {
		setFormData((current) => {
			const rows = JSON.parse(current[field.name]) as Record<string, string>[];
			const emptyRow = Object.fromEntries(
				(field.items ?? []).map((item) => [item.name, ""]),
			);
			emptyRow._id = `row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
			return { ...current, [field.name]: JSON.stringify([...rows, emptyRow]) };
		});
	};

	const removeRepeatable = (field: Field, index: number) => {
		setFormData((current) => {
			const rows = JSON.parse(current[field.name]) as Record<string, string>[];
			return {
				...current,
				[field.name]: JSON.stringify(
					rows.filter((_, rowIndex) => rowIndex !== index),
				),
			};
		});
	};

	const goNext = () => {
		if (!formRef.current?.reportValidity() || !currentGroup) return;
		for (const pair of countPairs) {
			if (
				currentGroup.fields.some((field) =>
					[pair.total, pair.male, pair.female].includes(field.name),
				) &&
				Number(formData[pair.male]) + Number(formData[pair.female]) !==
					Number(formData[pair.total])
			) {
				setStatus("error");
				setErrorMessage(`จำนวนชายและหญิงต้องรวมกันเท่ากับจำนวน${pair.label}`);
				return;
			}
		}

		for (const field of currentGroup.fields) {
			const value = formData[field.name];
			if (field.type === "number" && !Number.isInteger(Number(value))) {
				setStatus("error");
				setErrorMessage(`${field.label} ต้องเป็นจำนวนเต็ม`);
				return;
			}
		}

		setErrorMessage(null);
		setStatus("idle");
		setCurrentStep((step) => step + 1);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const sendApplication = async () => {
		setStatus("submitting");
		setErrorMessage(null);
		setCreatedId(null);

		try {
			const payload: Record<string, unknown> = {};
			for (const field of allFields) {
				const value = formData[field.name];
				if (field.type === "number") {
					const numberValue = Number(value);
					if (!Number.isInteger(numberValue))
						throw new Error(`${field.label} ต้องเป็นจำนวนเต็ม`);
					payload[field.name] = numberValue;
				} else if (field.type === "repeatable") {
					const rows = JSON.parse(value) as Record<string, string>[];
					payload[field.name] = rows.map((row) =>
						Object.fromEntries(
							(field.items ?? []).map((item) => [
								item.name,
								item.type === "number"
									? Number(row[item.name])
									: row[item.name],
							]),
						),
					);
				} else {
					payload[field.name] = value;
				}
			}

			const response = await fetch("/api/form", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "ส่งใบสมัครไม่สำเร็จ");

			setCreatedId(result.data?.id ?? null);
			setStatus("success");
			setFormData(emptyForm());
			setCurrentStep(0);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (error) {
			setStatus("error");
			setErrorMessage(
				error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่คาดคิด",
			);
		}
	};

	const progressPercentage = Math.round(((currentStep + 1) / totalSteps) * 100);

	return (
		<div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-4xl">
				{/* Top Hero Header */}
				<div className="mb-8 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
					<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
								<span className="h-1.5 w-1.5 rounded-full bg-[#05a44d] animate-pulse" />
								<span>ระบบรับสมัครงานออนไลน์</span>
							</div>
							<h1 className="mt-3 font-extrabold text-2xl text-zinc-900 tracking-tight sm:text-3xl dark:text-zinc-50">
								แบบฟอร์มสมัครงาน
							</h1>
							<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
								กรุณากรอกข้อมูลให้ครบถ้วนเพื่อประกอบการพิจารณาคัดเลือกเข้าทำงาน
							</p>
						</div>

						<Link
							href="/form"
							className="inline-flex items-center gap-2 self-start rounded-xl border border-zinc-200 bg-white px-4 py-2.5 font-medium text-sm text-zinc-700 shadow-xs transition hover:border-[#05a44d] hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
						>
							<svg
								className="h-4 w-4 text-[#05a44d]"
								aria-hidden="true"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
								/>
							</svg>
							<span>ดูใบสมัครทั้งหมด</span>
						</Link>
					</div>

					{/* Stepper Progress Bar */}
					<div className="mt-8 border-zinc-100 border-t pt-6 dark:border-zinc-800">
						<div className="flex items-center justify-between font-medium text-xs text-zinc-500 dark:text-zinc-400">
							<div className="flex items-center gap-2">
								<span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#05a44d] font-bold text-[11px] text-white">
									{currentStep + 1}
								</span>
								<span className="font-semibold text-zinc-900 dark:text-zinc-100">
									ขั้นตอนที่ {currentStep + 1} จาก {totalSteps}:
								</span>
								<span>
									{summaryStep ? "ตรวจสอบใบสมัคร" : currentGroup?.title}
								</span>
							</div>
							<span className="font-semibold text-[#05a44d]">
								{progressPercentage}%
							</span>
						</div>

						<div
							className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
							role="progressbar"
							aria-valuemin={1}
							aria-valuemax={totalSteps}
							aria-valuenow={currentStep + 1}
						>
							<div
								className="h-full rounded-full bg-gradient-to-r from-[#04843d] via-[#05a44d] to-[#06b856] transition-all duration-300"
								style={{ width: `${progressPercentage}%` }}
							/>
						</div>

						{/* Step indicator bubbles */}
						<div className="mt-4 hidden grid-cols-8 gap-2 sm:grid">
							{groups.map((grp, index) => {
								const isDone = currentStep > index;
								const isCurrent = currentStep === index;
								return (
									<button
										key={grp.title}
										type="button"
										onClick={() => {
											if (index <= currentStep) setCurrentStep(index);
										}}
										className={`flex flex-col items-center gap-1 rounded-xl p-1.5 text-center transition ${
											isCurrent
												? "bg-[#05a44d]/10 font-bold text-[#05a44d]"
												: isDone
													? "cursor-pointer text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
													: "cursor-default text-zinc-400 opacity-60 dark:text-zinc-600"
										}`}
									>
										<span
											className={`flex h-6 w-6 items-center justify-center rounded-full font-semibold text-xs ${
												isCurrent
													? "bg-[#05a44d] text-white shadow-xs"
													: isDone
														? "bg-emerald-100 text-[#05a44d] dark:bg-emerald-950 dark:text-emerald-300"
														: "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
											}`}
										>
											{isDone ? "✓" : index + 1}
										</span>
										<span className="truncate text-[14px]">
											{grp.title.replace("ข้อมูล", "").replace("ประวัติ", "")}
										</span>
									</button>
								);
							})}

							{/* Review step bubble */}
							<button
								type="button"
								onClick={() => {
									if (summaryStep) setCurrentStep(groups.length);
								}}
								className={`flex flex-col items-center gap-1 rounded-xl p-1.5 text-center transition ${
									summaryStep
										? "bg-[#05a44d]/10 font-bold text-[#05a44d]"
										: "cursor-default text-zinc-400 opacity-60 dark:text-zinc-600"
								}`}
							>
								<span
									className={`flex h-6 w-6 items-center justify-center rounded-full font-semibold text-xs ${
										summaryStep
											? "bg-[#05a44d] text-white shadow-xs"
											: "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
									}`}
								>
									✓
								</span>
								<span className="truncate text-[10px]">ตรวจสอบ</span>
							</button>
						</div>
					</div>
				</div>

				{/* Success Banner */}
				{status === "success" && (
					<div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 shadow-xs dark:border-green-900/50 dark:bg-green-950/40">
						<div className="flex items-start gap-3.5">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
								<svg
									className="h-5 w-5"
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
							</div>
							<div className="flex-1">
								<h3 className="font-semibold text-green-900 text-sm dark:text-green-200">
									บันทึกใบสมัครเรียบร้อยแล้ว!
								</h3>
								<p className="mt-1 text-green-800 text-xs dark:text-green-300">
									ระบบได้จัดเก็บข้อมูลใบสมัครของท่านเรียบร้อยแล้ว
									{createdId ? ` (เลขที่อ้างอิง: #${createdId})` : ""}
								</p>
							</div>
							<Link
								href="/form"
								className="rounded-lg bg-[#05a44d] px-3.5 py-1.5 font-medium text-white text-xs shadow-xs hover:bg-[#048b41]"
							>
								ดูในตารางใบสมัคร →
							</Link>
						</div>
					</div>
				)}

				{/* Error Banner */}
				{status === "error" && (
					<div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 shadow-xs dark:border-red-900/50 dark:bg-red-950/40">
						<div className="flex items-start gap-3.5">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white">
								<svg
									className="h-5 w-5"
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
							<div>
								<h3 className="font-semibold text-red-900 text-sm dark:text-red-200">
									กรุณาตรวจสอบข้อมูล
								</h3>
								<p className="mt-1 text-red-800 text-xs dark:text-red-300">
									{errorMessage}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Main Form Form Body */}
				<form
					ref={formRef}
					onSubmit={(event) => {
						event.preventDefault();
						if (!summaryStep) goNext();
					}}
					className="space-y-6"
					aria-busy={status === "submitting"}
				>
					{currentGroup ? (
						<section className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
							<div className="mb-6 border-zinc-100 border-b pb-4 dark:border-zinc-800">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl shadow-inner dark:bg-emerald-950/60">
										{groupIcons[currentGroup.title] || "📝"}
									</div>
									<div>
										<h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
											{currentGroup.title}
										</h2>
										<p className="text-xs text-zinc-500 dark:text-zinc-400">
											{currentGroup.subtitle}
										</p>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
								{currentGroup.fields.map((field) => {
									const inputClass =
										"mt-1.5 block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 shadow-2xs transition placeholder:text-zinc-400 focus:border-[#05a44d] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#05a44d]/15 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-[#05a44d] dark:focus:bg-zinc-800 dark:focus:ring-[#05a44d]/20";
									return (
										<div
											key={field.name}
											className={field.wide ? "sm:col-span-2" : ""}
										>
											<label
												htmlFor={field.name}
												className="flex items-center justify-between font-medium text-xs text-zinc-700 dark:text-zinc-300"
											>
												<span>
													{field.label} <span className="text-red-500">*</span>
												</span>
												{field.unit && (
													<span className="font-normal text-[11px] text-zinc-400">
														({field.unit})
													</span>
												)}
											</label>

											{field.type === "enum" ? (
												<select
													id={field.name}
													name={field.name}
													required
													value={formData[field.name]}
													onChange={handleChange}
													className={inputClass}
												>
													<option value="" disabled>
														เลือก{field.label}
													</option>
													{field.options?.map((option) => (
														<option key={option} value={option}>
															{enumLabels[option] ?? option}
														</option>
													))}
												</select>
											) : field.type === "repeatable" ? (
												<div className="mt-2 space-y-4">
													{(
														JSON.parse(formData[field.name]) as (Record<
															string,
															string
														> & { _id?: string })[]
													).map((row, index) => (
														<div
															key={row._id ?? JSON.stringify(row)}
															className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 shadow-2xs dark:border-zinc-700/80 dark:bg-zinc-800/40"
														>
															<div className="mb-4 flex items-center justify-between border-zinc-200/60 border-b pb-2.5 dark:border-zinc-700/60">
																<span className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">
																	รายการที่ #{index + 1}
																</span>
																<button
																	type="button"
																	onClick={() => removeRepeatable(field, index)}
																	className="inline-flex items-center gap-1 font-medium text-red-600 text-xs hover:text-red-700 dark:text-red-400"
																>
																	<svg
																		className="h-3.5 w-3.5"
																		aria-hidden="true"
																		fill="none"
																		stroke="currentColor"
																		viewBox="0 0 24 24"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			strokeWidth={2}
																			d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
																		/>
																	</svg>
																	<span>ลบรายการนี้</span>
																</button>
															</div>

															<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
																{field.items?.map((item) => {
																	const inputId = `${field.name}-${index}-${item.name}`;
																	return (
																		<div key={item.name}>
																			<label
																				htmlFor={inputId}
																				className="block font-medium text-[11px] text-zinc-600 dark:text-zinc-400"
																			>
																				{item.label}
																			</label>
																			{item.type === "enum" ? (
																				<select
																					id={inputId}
																					required
																					value={row[item.name] ?? ""}
																					onChange={(event) =>
																						updateRepeatable(
																							field,
																							index,
																							item.name,
																							event.target.value,
																						)
																					}
																					className={inputClass}
																				>
																					<option value="" disabled>
																						เลือกระดับการศึกษา
																					</option>
																					{item.options?.map((option) => (
																						<option key={option} value={option}>
																							{enumLabels[option] ?? option}
																						</option>
																					))}
																				</select>
																			) : (
																				<input
																					id={inputId}
																					type={item.type ?? "text"}
																					required
																					min={
																						item.type === "number"
																							? 0
																							: undefined
																					}
																					step={
																						item.type === "number"
																							? 1
																							: undefined
																					}
																					value={row[item.name] ?? ""}
																					onChange={(event) =>
																						updateRepeatable(
																							field,
																							index,
																							item.name,
																							event.target.value,
																						)
																					}
																					className={inputClass}
																				/>
																			)}
																		</div>
																	);
																})}
															</div>
														</div>
													))}

													<button
														type="button"
														onClick={() => addRepeatable(field)}
														className="inline-flex items-center gap-1.5 rounded-xl border-2 border-zinc-200 border-dashed px-4 py-2.5 font-semibold text-xs text-zinc-700 transition hover:border-[#05a44d] hover:bg-emerald-50/50 hover:text-[#05a44d] dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
													>
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
																d="M12 4v16m8-8H4"
															/>
														</svg>
														<span>เพิ่ม{field.label}</span>
													</button>
												</div>
											) : (
												<>
													<input
														id={field.name}
														name={field.name}
														type={field.type ?? "text"}
														required
														min={field.type === "number" ? 0 : undefined}
														step={field.type === "number" ? 1 : undefined}
														pattern={
															field.name === "postal"
																? "[0-9]{5}"
																: field.name === "card_no"
																	? "[0-9]{13}"
																	: field.name === "phone"
																		? "0[0-9]{9}"
																		: undefined
														}
														maxLength={
															field.name === "postal"
																? 5
																: field.name === "card_no"
																	? 13
																	: field.name === "phone"
																		? 10
																		: undefined
														}
														inputMode={
															field.name === "phone" ||
															field.name === "card_no" ||
															field.name === "postal"
																? "numeric"
																: undefined
														}
														title={
															field.name === "postal"
																? "กรอกตัวเลข 5 หลัก"
																: field.name === "card_no"
																	? "กรอกตัวเลข 13 หลัก"
																	: field.name === "phone"
																		? "กรอกตัวเลข 10 หลัก โดยขึ้นต้นด้วย 0"
																		: undefined
														}
														value={formData[field.name]}
														onChange={handleChange}
														className={inputClass}
													/>
													{field.name === "dateofbirth" && age !== null && (
														<div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
															<span>อายุคำนวณได้:</span>
															<span className="font-bold">{age} ปี</span>
														</div>
													)}
												</>
											)}
										</div>
									);
								})}
							</div>
						</section>
					) : (
						/* ======================================================== */
						/* STEP 8: ตรวจสอบข้อมูลทั้งหมดก่อนส่งใบสมัคร                */
						/* ======================================================== */
						<section className="space-y-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
							<div className="border-zinc-100 border-b pb-4 dark:border-zinc-800">
								<h2 className="font-bold text-xl text-zinc-900 tracking-tight dark:text-zinc-100">
									ตรวจสอบข้อมูลทั้งหมด
								</h2>
								<p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
									กรุณาตรวจสอบความถูกต้องของข้อมูลทุกส่วนก่อนกดยืนยันส่งใบสมัคร
								</p>
							</div>

							{groups.map((group) => (
								<div
									key={group.title}
									className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/40"
								>
									<h3 className="mb-4 flex items-center gap-2 font-bold text-sm text-[#05a44d]">
										<span>{groupIcons[group.title] || "📌"}</span>
										<span>{group.title}</span>
									</h3>

									<dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										{group.fields.map((field) => (
											<div
												key={field.name}
												className={field.wide ? "sm:col-span-2" : ""}
											>
												<dt className="font-medium text-xs text-zinc-500 dark:text-zinc-400">
													{field.label}
												</dt>
												<dd className="mt-1 font-medium text-sm text-zinc-900 dark:text-zinc-100">
													{field.type === "repeatable"
														? (() => {
																try {
																	const rows = JSON.parse(
																		formData[field.name],
																	) as (Record<string, string> & {
																		_id?: string;
																	})[];
																	if (!rows || rows.length === 0)
																		return (
																			<span className="text-zinc-400 italic">
																				ไม่มีรายการ
																			</span>
																		);
																	return (
																		<div className="mt-2 space-y-2">
																			{rows.map((row, idx) => (
																				<div
																					key={row._id ?? JSON.stringify(row)}
																					className="rounded-xl border border-zinc-200/80 bg-white p-3 text-xs shadow-2xs dark:border-zinc-700 dark:bg-zinc-800"
																				>
																					<span className="font-semibold text-emerald-700 dark:text-emerald-400">
																						#{idx + 1}:
																					</span>{" "}
																					{Object.entries(row)
																						.map(
																							([k, v]) =>
																								`${k}: ${enumLabels[v] ?? (v || "—")}`,
																						)
																						.join(" | ")}
																				</div>
																			))}
																		</div>
																	);
																} catch {
																	return "—";
																}
															})()
														: field.type === "enum"
															? (enumLabels[formData[field.name]] ??
																formData[field.name] ??
																"—")
															: formData[field.name] || "—"}
												</dd>
											</div>
										))}
									</dl>
								</div>
							))}
						</section>
					)}

					{/* Navigation Action Buttons */}
					<div className="flex items-center justify-between gap-3 pt-2">
						<button
							type="button"
							onClick={(event) => {
								event.preventDefault();
								if (!scrolledRecently())
									setCurrentStep((step) => Math.max(0, step - 1));
							}}
							disabled={currentStep === 0 || status === "submitting"}
							className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-3 font-semibold text-sm text-zinc-700 shadow-2xs transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
						>
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
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							<span>ย้อนกลับ</span>
						</button>

						{summaryStep ? (
							<button
								type="button"
								onClick={(event) => {
									event.preventDefault();
									if (!scrolledRecently()) void sendApplication();
								}}
								disabled={status === "submitting"}
								className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#04843d] via-[#05a44d] to-[#06b856] px-7 py-3 font-semibold text-sm text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg disabled:cursor-wait disabled:opacity-60"
							>
								{status === "submitting" ? (
									<>
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
										<span>กำลังส่งใบสมัคร...</span>
									</>
								) : (
									<>
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
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<span>ยืนยันส่งใบสมัคร</span>
									</>
								)}
							</button>
						) : (
							<button
								type="button"
								onClick={(event) => {
									event.preventDefault();
									if (!scrolledRecently()) goNext();
								}}
								className="inline-flex items-center gap-2 rounded-xl bg-[#05a44d] px-6 py-3 font-semibold text-sm text-white shadow-md transition hover:bg-[#048b41] hover:shadow-lg active:scale-98"
							>
								<span>ถัดไป</span>
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
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}
