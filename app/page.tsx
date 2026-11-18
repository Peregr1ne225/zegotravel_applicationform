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
};

const groups: { title: string; fields: Field[] }[] = [
	{
		title: "ข้อมูลผู้สมัคร",
		fields: [
			{ name: "name", label: "ชื่อ-นามสกุล" },
			{ name: "nickname", label: "ชื่อเล่น" },
			{
				name: "day_birth",
				label: "วันเกิด",
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
			{ name: "position", label: "ตำแหน่งที่ต้องการ" },
			{ name: "expected_salary", label: "เงินเดือนที่คาดหวัง (บาท)", type: "number" },
		],
	},
	{
		title: "ที่อยู่ปัจจุบัน",
		fields: [
			{
				name: "home_type",
				label: "ประเภทที่อยู่อาศัย",
				type: "enum",
				options: ["Parent", "Own", "Hired", "Flat"],
			},
			{ name: "address", label: "เลขที่" },
			{ name: "moo", label: "หมู่ที่" },
			{ name: "road", label: "ถนน" },
			{ name: "district", label: "ตำบล/แขวง" },
			{ name: "amphur", label: "อำเภอ/เขต" },
			{ name: "province", label: "จังหวัด" },
			{ name: "postal", label: "รหัสไปรษณีย์ (5 หลัก)" },
		],
	},
	{
		title: "การติดต่อ",
		fields: [
			{ name: "phone", label: "โทรศัพท์ (10 หลัก ขึ้นต้นด้วย 0)", type: "tel" },
			{ name: "email", label: "อีเมล", type: "email" },
			{ name: "line_id", label: "Line ID" },
			{ name: "facebook", label: "Facebook" },
			{ name: "ig_id", label: "IG" },
		],
	},
	{
		title: "ข้อมูลส่วนบุคคล",
		fields: [
			{ name: "dateofbirth", label: "วัน เดือน ปี เกิด", type: "date" },
			{ name: "race", label: "เชื้อชาติ" },
			{ name: "nation", label: "สัญชาติ" },
			{ name: "religion", label: "ศาสนา" },
			{ name: "card_no", label: "บัตรประชาชนเลขที่ (13 หลัก)", type: "tel" },
			{ name: "expiration_date", label: "บัตรหมดอายุ", type: "date" },
			{ name: "height", label: "ส่วนสูง", type: "number" },
			{ name: "weight", label: "น้ำหนัก", type: "number" },
			{
				name: "military",
				label: "ภาวะทางทหาร",
				type: "enum",
				options: ["exempted", "served", "notyet"],
			},
			{
				name: "marital",
				label: "สถานภาพ",
				type: "enum",
				options: ["single", "married", "widowed", "seperated"],
			},
			{ name: "sex", label: "เพศ", type: "enum", options: ["Male", "Female"] },
		],
	},
	{
		title: "ประวัติครอบครัว",
		fields: [
			{ name: "father_name", label: "บิดา ชื่อ-สกุล", wide: true },
			{ name: "father_age", label: "อายุ", type: "number" },
			{ name: "father_occupation", label: "อาชีพ" },
			{ name: "mother_name", label: "มารดา ชื่อ-สกุล", wide: true },
			{ name: "mother_age", label: "อายุ", type: "number" },
			{ name: "mother_occupation", label: "อาชีพ" },
			{ name: "spouse_name", label: "ชื่อภรรยา/สามี" },
			{ name: "spouse_working_place", label: "สถานที่ทำงาน" },
			{ name: "spouse_position", label: "ตำแหน่ง" },
			{ name: "children", label: "มีบุตร", type: "number" },
			{ name: "children_male", label: "ชาย", type: "number" },
			{ name: "children_female", label: "หญิง", type: "number" },
		],
	},
	{
		title: "ประวัติพี่น้อง",
		fields: [
			{ name: "sibling", label: "มีพี่น้อง(รวมผู้สมัคร)", type: "number", wide: true},
			{ name: "sibling_male", label: "ชาย", type: "number" },
			{ name: "sibling_female", label: "หญิง", type: "number" },
			{
				name: "sibling_member",
				label: "รายละเอียดพี่น้อง",
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
		fields: [
			{
				name: "education",
				label: "ประวัติการศึกษา",
				type: "repeatable",
				items: [
					{ name: "level", label: "ระดับการศึกษา", type: "enum", options: ["High School", "Vocational", "Diploma", "Bachelor Degree", "PostGrauate", "Others"]},
					{ name: "institution", label: "สถาบัน" },
					{ name: "major", label: "สาขาวิชา" },
					{ name: "ed_from", label: "ตั้งแต่" },
					{ name: "ed_to", label: "ถึง" },
				],
				wide: true,
			},
			{
				name: "job",
				label: "ประวัติการทำงาน ก่อน-หลัง",
				type: "repeatable",
				items: [
					{ name: "company", label: "บริษัท" },
					{ name: "work_from", label: "ตั้งแต่" },
					{ name: "work_to", label: "ถึง" },
					{ name: "position", label: "ตำแหน่ง" },
					{ name: "job_description", label: "ลักษณะงาน" },
					{ name: "salary", label: "เงินเดือน (บาท)", type: "number" },
					{ name: "resignation", label: "เหตุผลที่ลาออก" },
				],
				wide: true,
			},
		],
	},
];

const enumLabels: Record<string, string> = {
	Parent: "อาศัยกับครอบครัว",
	Own: "บ้านของตนเอง",
	Hired: "บ้านเช่า",
	Flat: "หอพัก",
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
	Diploma: "อนุปริญญา/ประกาศนียบัตร (ปวส.)",
	"Bachelor Degree": "ปริญญาตรี",
	PostGrauate: "สูงกว่าปริญญาตรี",
	Others: "อื่น ๆ",
};

const allFields = groups.flatMap((group) => group.fields);
const countPairs = [
	{ total: "sibling", male: "sibling_male", female: "sibling_female", label: "พี่น้อง" },
	{ total: "children", male: "children_male", female: "children_female", label: "บุตร" },
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
	const age = today && formData.dateofbirth
		? Number(today.slice(0, 4)) - Number(formData.dateofbirth.slice(0, 4)) -
		  (today.slice(5) < formData.dateofbirth.slice(5) ? 1 : 0)
		: null;

	useEffect(() => {
		const now = new Date();
		setToday(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`);
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

	const updateRepeatable = (field: Field, index: number, key: string, value: string) => {
		setFormData((current) => {
			const rows = JSON.parse(current[field.name]) as Record<string, string>[];
			rows[index] = { ...rows[index], [key]: value };
			return { ...current, [field.name]: JSON.stringify(rows) };
		});
	};

	const addRepeatable = (field: Field) => {
		setFormData((current) => {
			const rows = JSON.parse(current[field.name]) as Record<string, string>[];
			const emptyRow = Object.fromEntries((field.items ?? []).map((item) => [item.name, ""]));
			return { ...current, [field.name]: JSON.stringify([...rows, emptyRow]) };
		});
	};

	const removeRepeatable = (field: Field, index: number) => {
		setFormData((current) => {
			const rows = JSON.parse(current[field.name]) as Record<string, string>[];
			return { ...current, [field.name]: JSON.stringify(rows.filter((_, rowIndex) => rowIndex !== index)) };
		});
	};

	const goNext = () => {
		if (!formRef.current?.reportValidity() || !currentGroup) return;
		for (const pair of countPairs) {
			if (
				currentGroup.fields.some((field) => [pair.total, pair.male, pair.female].includes(field.name)) &&
				Number(formData[pair.male]) + Number(formData[pair.female]) !== Number(formData[pair.total])
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
				setErrorMessage(`${field.label}ต้องเป็นจำนวนเต็ม`);
				return;
			}
		}

		setErrorMessage(null);
		setStatus("idle");
		setCurrentStep((step) => step + 1);
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
						throw new Error(`${field.label}ต้องเป็นจำนวนเต็ม`);
					payload[field.name] = numberValue;
				} else if (field.type === "repeatable") {
					const rows = JSON.parse(value) as Record<string, string>[];
					payload[field.name] = rows.map((row) => Object.fromEntries(
						(field.items ?? []).map((item) => [item.name, item.type === "number" ? Number(row[item.name]) : row[item.name]]),
					));
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
		} catch (error) {
			setStatus("error");
			setErrorMessage(
				error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่คาดคิด",
			);
		}
	};

	return (
		<div className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
							แบบฟอร์มสมัครงาน
						</h1>
						<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
							กรุณากรอกข้อมูลทุกช่อง และเพิ่มรายการพี่น้อง การศึกษา
							หรือประวัติการทำงานได้ตามต้องการ
						</p>
					</div>
					<Link
						href="/form"
						className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
					>
						ดูใบสมัครทั้งหมด
					</Link>
				</div>

				{status === "success" && (
					<div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-200">
						บันทึกใบสมัครเรียบร้อยแล้ว{createdId ? ` (เลขที่ ${createdId})` : ""}
					</div>
				)}
				{status === "error" && (
					<div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
						{errorMessage}
					</div>
				)}

				<form
					ref={formRef}
					onSubmit={(event) => {
						event.preventDefault();
						if (!summaryStep) goNext();
					}}
					className="space-y-5"
					aria-busy={status === "submitting"}
				>
					<div
						className="rounded-full bg-zinc-200 dark:bg-zinc-800"
						role="progressbar"
						aria-valuemin={1}
						aria-valuemax={totalSteps}
						aria-valuenow={currentStep + 1}
					>
						<div
							className="h-2 rounded-full bg-zinc-900 transition-all dark:bg-zinc-100"
							style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
						/>
					</div>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">
						ขั้นตอนที่ {currentStep + 1} จาก {totalSteps}:{" "}
						{summaryStep ? "ตรวจสอบใบสมัคร" : currentGroup?.title}
					</p>

					{currentGroup ? (
						<section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
							<h2 className="mb-5 border-b border-zinc-100 pb-3 text-lg font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
								{currentGroup.title}
							</h2>
							<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
								{currentGroup.fields.map((field) => {
									const inputClass =
										"mt-1.5 block w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100";
									return (
										<div
											key={field.name}
											className={field.wide ? "sm:col-span-2" : ""}
										>
											<label
												htmlFor={field.name}
												className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
											>
												{field.label} <span aria-hidden="true">*</span>
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
								<div className="space-y-4">
									{(JSON.parse(formData[field.name]) as Record<string, string>[]).map((row, index) => (
										<fieldset key={`${field.name}-${index}`} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
											<legend className="px-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">รายการที่ {index + 1}</legend>
											<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
												{field.items?.map((item) => (
													<label key={item.name} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
														{item.label}
													{item.type === "enum" ? (
														<select required value={row[item.name] ?? ""} onChange={(event) => updateRepeatable(field, index, item.name, event.target.value)} className={inputClass}>
															<option value="" disabled>เลือกระดับการศึกษา</option>
															{item.options?.map((option) => <option key={option} value={option}>{enumLabels[option] ?? option}</option>)}
														</select>
													) : (
														<input type={item.type ?? "text"} required min={item.type === "number" ? 0 : undefined} step={item.type === "number" ? 1 : undefined} value={row[item.name] ?? ""} onChange={(event) => updateRepeatable(field, index, item.name, event.target.value)} className={inputClass} />
													)}
													</label>
												))}
											</div>
											<button type="button" onClick={() => removeRepeatable(field, index)} className="mt-3 text-sm font-medium text-red-600 hover:text-red-700">ลบรายการ</button>
										</fieldset>
									))}
									<button type="button" onClick={() => addRepeatable(field)} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800">+ เพิ่ม{field.label}</button>
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
															pattern={field.name === "postal" ? "[0-9]{5}" : field.name === "card_no" ? "[0-9]{13}" : field.name === "phone" ? "0[0-9]{9}" : undefined}
															maxLength={field.name === "postal" ? 5 : field.name === "card_no" ? 13 : field.name === "phone" ? 10 : undefined}
													inputMode={
										field.name === "phone" || field.name === "card_no" || field.name === "postal" ? "numeric" : undefined
													}
									title={field.name === "postal" ? "กรอกตัวเลข 5 หลัก" : field.name === "card_no" ? "กรอกตัวเลข 13 หลัก" : field.name === "phone" ? "กรอกตัวเลข 10 หลัก โดยขึ้นต้นด้วย 0" : undefined}
													value={formData[field.name]}
													onChange={handleChange}
													className={inputClass}
													/>
								{field.name === "dateofbirth" && (
													<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">อายุ: {age === null ? "—" : `${age} ปี`}</p>
												)}
								</>
											)}
										</div>
									);
								})}
							</div>
						</section>
					) : (
						<section className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
							<h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
								ตรวจสอบข้อมูลทั้งหมด
							</h2>
							{groups.map((group) => (
								<div key={group.title}>
									<h3 className="mb-3 border-b border-zinc-100 pb-2 font-medium text-zinc-800 dark:border-zinc-800 dark:text-zinc-200">
										{group.title}
									</h3>
									<dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										{group.fields.map((field) => (
											<div
												key={field.name}
												className={field.wide ? "sm:col-span-2" : ""}
											>
												<dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
													{field.label}
												</dt>
												<dd className="mt-1 break-words text-sm text-zinc-900 dark:text-zinc-100">
										{field.type === "repeatable" ? (
														<pre className="overflow-x-auto rounded-lg bg-zinc-100 p-3 text-xs dark:bg-zinc-800">
															{JSON.stringify(
																JSON.parse(formData[field.name]),
																null,
																2,
															)}
														</pre>
													) : field.type === "enum" ? (
														(enumLabels[formData[field.name]] ??
														formData[field.name])
													) : (
														formData[field.name] || "—"
													)}
												</dd>
											</div>
										))}
									</dl>
								</div>
							))}
						</section>
					)}

					<div className="flex items-center justify-between gap-3">
						<button
							type="button"
							onClick={(event) => {
								event.preventDefault();
								if (!scrolledRecently())
									setCurrentStep((step) => Math.max(0, step - 1));
							}}
							disabled={currentStep === 0 || status === "submitting"}
							className="rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
						>
							ย้อนกลับ
						</button>
						{summaryStep ? (
							<button
								type="button"
								onClick={(event) => {
									event.preventDefault();
									if (!scrolledRecently()) void sendApplication();
								}}
								disabled={status === "submitting"}
								className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
							>
								{status === "submitting" ? "กำลังส่ง…" : "ส่งใบสมัคร"}
							</button>
						) : (
							<button
								type="button"
								onClick={(event) => {
									event.preventDefault();
									if (!scrolledRecently()) goNext();
								}}
								className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
							>
								ถัดไป
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}
