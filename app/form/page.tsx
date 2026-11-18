"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface FormRecord {
	id: string;
	name: string;
	email: string | null;
	position: string | null;
	address: string | null;
	[key: string]: unknown;
}

export default function FormsTablePage() {
	const [records, setRecords] = useState<FormRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [selectedRecord, setSelectedRecord] = useState<FormRecord | null>(null);

	const fetchRecords = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/form", { cache: "no-store" });
			const result = await res.json();

			if (!res.ok) {
				throw new Error(result.error || "ไม่สามารถโหลดข้อมูลใบสมัครได้");
			}

			setRecords(result.data || []);
		} catch (err) {
			setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRecords();
	}, [fetchRecords]);

	const handleDelete = async (id: string) => {
		if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบใบสมัครนี้?")) {
			return;
		}

		setDeletingId(id);
		try {
			const res = await fetch(`/api/form?id=${encodeURIComponent(id)}`, {
				method: "DELETE",
			});
			const result = await res.json();

			if (!res.ok) {
				throw new Error(result.error || "ไม่สามารถลบใบสมัครได้");
			}

			setRecords((prev) => prev.filter((r) => r.id !== id));
			if (selectedRecord?.id === id) {
				setSelectedRecord(null);
			}
		} catch (err) {
			alert(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลบข้อมูล");
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				{/* Header */}
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="font-bold text-2xl text-zinc-900 tracking-tight sm:text-3xl dark:text-zinc-50">
							รายการใบสมัครงาน
						</h1>
						<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
							ดู จัดการ และตรวจสอบข้อมูลผู้สมัครงานทั้งหมดในระบบ
						</p>
					</div>
					<div className="flex items-center gap-2.5">
						<button
							type="button"
							onClick={fetchRecords}
							disabled={loading}
							className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 font-medium text-sm text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
						>
							<svg
								className={`h-4 w-4 text-zinc-500 ${loading ? "animate-spin" : ""}`}
								aria-hidden="true"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							รีเฟรช
						</button>
						<Link
							href="/"
							className="inline-flex items-center gap-1.5 rounded-lg bg-[#05a44d] px-4 py-2 font-medium text-sm text-white shadow-sm transition hover:bg-[#048b41]"
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
							สร้างใบสมัครใหม่
						</Link>
					</div>
				</div>

				{/* Error Notice */}
				{error && (
					<div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/40">
						<div className="flex items-center gap-3">
							<svg
								className="h-5 w-5 text-red-600 dark:text-red-400"
								aria-hidden="true"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<div className="flex-1">
								<h3 className="font-medium text-red-800 text-sm dark:text-red-200">
									ไม่สามารถดึงข้อมูลได้
								</h3>
								<p className="text-red-700 text-xs dark:text-red-300">
									{error}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Loading State */}
				{loading && (
					<div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
						<div className="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-zinc-100 dark:border-t-transparent" />
						<p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
							กำลังโหลดข้อมูลใบสมัคร...
						</p>
					</div>
				)}

				{/* Empty State */}
				{!loading && !error && records.length === 0 && (
					<div className="rounded-2xl border border-zinc-300 border-dashed bg-white py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
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
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<h3 className="mt-4 font-semibold text-base text-zinc-900 dark:text-zinc-100">
							ยังไม่มีข้อมูลใบสมัคร
						</h3>
						<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
							เริ่มต้นด้วยการกรอกและส่งแบบฟอร์มใบสมัครงาน
						</p>
						<div className="mt-6">
							<Link
								href="/"
								className="inline-flex items-center gap-2 rounded-lg bg-[#05a44d] px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-[#048b41]"
							>
								ไปยังหน้าแบบฟอร์มสมัครงาน
							</Link>
						</div>
					</div>
				)}

				{/* Table */}
				{!loading && records.length > 0 && (
					<div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
								<thead className="bg-zinc-50/75 dark:bg-zinc-800/50">
									<tr>
										<th
											scope="col"
											className="px-6 py-3.5 text-left font-semibold text-xs text-zinc-500 tracking-wider dark:text-zinc-400"
										>
											ชื่อ-นามสกุล และ อีเมล
										</th>
										<th
											scope="col"
											className="px-6 py-3.5 text-left font-semibold text-xs text-zinc-500 tracking-wider dark:text-zinc-400"
										>
											ตำแหน่งที่ต้องการ
										</th>
										<th
											scope="col"
											className="px-6 py-3.5 text-left font-semibold text-xs text-zinc-500 tracking-wider dark:text-zinc-400"
										>
											ที่อยู่
										</th>
										<th
											scope="col"
											className="px-6 py-3.5 text-right font-semibold text-xs text-zinc-500 tracking-wider dark:text-zinc-400"
										>
											การจัดการ
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
									{records.map((record) => {
										const data = (record.data as Record<string, unknown>) || {};
										const name = (record.name || data.name || "—") as string;
										const email = (record.email || data.email || "—") as string;
										const position = (record.position ||
											data.position ||
											"—") as string;
										const address = (record.address ||
											data.address ||
											"—") as string;

										return (
											<tr
												key={record.id}
												className="transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30"
											>
												<td className="whitespace-nowrap px-6 py-4">
													<Link
														href={`/form/${record.id}`}
														className="font-semibold text-sm text-zinc-900 transition hover:text-[#05a44d] dark:text-zinc-100 dark:hover:text-[#06b856]"
													>
														{name}
													</Link>
													<div className="text-xs text-zinc-500 dark:text-zinc-400">
														{email}
													</div>
												</td>
												<td className="whitespace-nowrap px-6 py-4">
													<span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 font-medium text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
														{position}
													</span>
												</td>
												<td className="max-w-xs truncate px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
													{address}
												</td>
												<td className="whitespace-nowrap px-6 py-4 text-right text-sm">
													<div className="flex items-center justify-end gap-2">
														<Link
															href={`/form/${record.id}`}
															className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1 font-medium text-xs text-zinc-700 shadow-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
														>
															ดูรายละเอียด →
														</Link>
														<button
															type="button"
															onClick={() => handleDelete(record.id)}
															disabled={deletingId === record.id}
															className="rounded-md border border-red-200 px-2.5 py-1 font-medium text-red-600 text-xs hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
														>
															{deletingId === record.id ? "กำลังลบ..." : "ลบ"}
														</button>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Details Modal */}
				{selectedRecord && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
						<div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
							<div className="flex items-center justify-between border-zinc-100 border-b pb-4 dark:border-zinc-800">
								<h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
									รายละเอียดข้อมูลผู้สมัคร
								</h3>
								<button
									type="button"
									onClick={() => setSelectedRecord(null)}
									className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
								>
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
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<div className="mt-4 space-y-3">
								<div>
									<span className="font-medium text-xs text-zinc-500 uppercase tracking-wider">
										รหัสใบสมัคร
									</span>
									<p className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
										{selectedRecord.id}
									</p>
								</div>
								<div>
									<span className="font-medium text-xs text-zinc-500 uppercase tracking-wider">
										ข้อมูลใบสมัคร (JSON)
									</span>
									<pre className="mt-1 max-h-60 overflow-auto rounded-lg bg-zinc-100 p-3 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
										{JSON.stringify(selectedRecord, null, 2)}
									</pre>
								</div>
							</div>

							<div className="mt-6 flex justify-end">
								<button
									type="button"
									onClick={() => setSelectedRecord(null)}
									className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-sm text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
								>
									ปิด
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
