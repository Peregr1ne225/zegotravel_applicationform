import { getSupabase } from "@/lib/supabase";

const TABLE = "forms";
const FORM_COLUMNS = new Set([
	"name",
	"nickname",
	"position",
	"expected_salary",
	"day_birth",
	"moo",
	"road",
	"district",
	"amphur",
	"province",
	"postal",
	"phone",
	"line_id",
	"ig_id",
	"email",
	"facebook",
	"home_type",
	"dateofbirth",
	"race",
	"nation",
	"religion",
	"card_no",
	"expiration_date",
	"height",
	"weight",
	"military",
	"marital",
	"sex",
	"father_name",
	"father_age",
	"father_occupation",
	"mother_name",
	"mother_age",
	"mother_occupation",
	"spouse_name",
	"spouse_working_place",
	"spouse_position",
	"children",
	"children_male",
	"children_female",
	"sibling",
	"sibling_male",
	"sibling_female",
	"sibling_member",
	"education",
	"job",
	"address",
]);

function configurationError(error: unknown) {
	if (
		error instanceof Error &&
		error.message.startsWith("Supabase is not configured")
	) {
		return Response.json({ error: "ยังไม่ได้ตั้งค่า Supabase" }, { status: 500 });
	}
	return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

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

function countsMatch(
	record: Record<string, unknown>,
	pair: (typeof countPairs)[number],
) {
	const total = Number(record[pair.total]);
	const male = Number(record[pair.male]);
	const female = Number(record[pair.female]);
	return (
		[total, male, female].every(
			(count) => Number.isInteger(count) && count >= 0,
		) && male + female === total
	);
}

export async function GET(request: Request) {
	try {
		const id = new URL(request.url).searchParams.get("id");
		let query = getSupabase().from(TABLE).select("*");
		if (id) query = query.eq("id", id);

		const { data, error } = await query;
		if (error) return Response.json({ error: error.message }, { status: 400 });
		return Response.json({ data });
	} catch (error) {
		return (
			configurationError(error) ??
			Response.json({ error: "Unable to read forms" }, { status: 500 })
		);
	}
}

export async function POST(request: Request) {
	try {
		const body: unknown = await request.json();
		if (!isRecord(body)) {
			return Response.json(
				{ error: "ข้อมูลที่ส่งมาต้องอยู่ในรูปแบบ JSON object" },
				{ status: 400 },
			);
		}
		if ("id" in body) {
			return Response.json(
				{ error: "ระบบสร้างค่า id ให้อัตโนมัติ ไม่ต้องส่งฟิลด์นี้" },
				{ status: 400 },
			);
		}
		const unknownColumns = Object.keys(body).filter(
			(key) => !FORM_COLUMNS.has(key),
		);
		if (unknownColumns.length) {
			return Response.json(
				{ error: `ไม่พบคอลัมน์ต่อไปนี้: ${unknownColumns.join(", ")}` },
				{ status: 400 },
			);
		}
		const missingColumns = [...FORM_COLUMNS].filter(
			(column) => body[column] == null,
		);
		if (missingColumns.length) {
			return Response.json(
				{ error: `กรุณากรอกข้อมูลในช่องต่อไปนี้: ${missingColumns.join(", ")}` },
				{ status: 400 },
			);
		}
		if (typeof body.name !== "string" || !body.name.trim()) {
			return Response.json({ error: "กรุณากรอกชื่อ-นามสกุล" }, { status: 400 });
		}
		if (typeof body.phone !== "string" || !/^0\d{9}$/.test(body.phone)) {
			return Response.json(
				{ error: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักและขึ้นต้นด้วย 0" },
				{ status: 400 },
			);
		}
		if (typeof body.card_no !== "string" || !/^\d{13}$/.test(body.card_no)) {
			return Response.json(
				{ error: "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก" },
				{ status: 400 },
			);
		}
		if (typeof body.postal !== "string" || !/^\d{5}$/.test(body.postal)) {
			return Response.json(
				{ error: "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก" },
				{ status: 400 },
			);
		}
		for (const pair of countPairs) {
			if (!countsMatch(body, pair)) {
				return Response.json(
					{ error: `จำนวนชายและหญิงต้องรวมกันเท่ากับจำนวน${pair.label}` },
					{ status: 400 },
				);
			}
		}

		const { data, error } = await getSupabase()
			.from(TABLE)
			.insert(body)
			.select()
			.single();
		if (error) return Response.json({ error: error.message }, { status: 400 });
		return Response.json({ data }, { status: 201 });
	} catch (error) {
		if (error instanceof SyntaxError) {
			return Response.json({ error: "รูปแบบ JSON ไม่ถูกต้อง" }, { status: 400 });
		}
		return (
			configurationError(error) ??
			Response.json({ error: "บันทึกใบสมัครไม่สำเร็จ" }, { status: 500 })
		);
	}
}

export async function PATCH(request: Request) {
	const id = new URL(request.url).searchParams.get("id");
	if (!id)
		return Response.json(
			{ error: "กรุณาระบุ id ใน query parameter" },
			{ status: 400 },
		);

	try {
		const body: unknown = await request.json();
		if (!isRecord(body) || Object.keys(body).length === 0) {
			return Response.json(
				{ error: "ข้อมูลที่ส่งมาต้องเป็น JSON object ที่ไม่ว่าง" },
				{ status: 400 },
			);
		}
		if ("id" in body) {
			return Response.json({ error: "ไม่สามารถเปลี่ยนค่า id ได้" }, { status: 400 });
		}
		const unknownColumns = Object.keys(body).filter(
			(key) => !FORM_COLUMNS.has(key),
		);
		if (unknownColumns.length) {
			return Response.json(
				{ error: `ไม่พบคอลัมน์ต่อไปนี้: ${unknownColumns.join(", ")}` },
				{ status: 400 },
			);
		}
		if (Object.values(body).some((value) => value == null)) {
			return Response.json(
				{ error: "ห้ามกำหนดค่าคอลัมน์เป็น null" },
				{ status: 400 },
			);
		}
		if (
			"phone" in body &&
			(typeof body.phone !== "string" || !/^0\d{9}$/.test(body.phone))
		) {
			return Response.json(
				{ error: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักและขึ้นต้นด้วย 0" },
				{ status: 400 },
			);
		}
		if (
			"card_no" in body &&
			(typeof body.card_no !== "string" || !/^\d{13}$/.test(body.card_no))
		) {
			return Response.json(
				{ error: "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก" },
				{ status: 400 },
			);
		}
		if (
			"postal" in body &&
			(typeof body.postal !== "string" || !/^\d{5}$/.test(body.postal))
		) {
			return Response.json(
				{ error: "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก" },
				{ status: 400 },
			);
		}
		const changedPairs = countPairs.filter((pair) =>
			[pair.total, pair.male, pair.female].some((column) => column in body),
		);
		if (changedPairs.length) {
			const columns = [
				...new Set(
					changedPairs.flatMap((pair) => [pair.total, pair.male, pair.female]),
				),
			].join(",");
			const { data: existing, error: readError } = await getSupabase()
				.from(TABLE)
				.select(columns)
				.eq("id", id)
				.single();
			if (readError)
				return Response.json({ error: readError.message }, { status: 400 });
			const updated = { ...existing, ...body };
			for (const pair of changedPairs) {
				if (!countsMatch(updated, pair)) {
					return Response.json(
						{ error: `จำนวนชายและหญิงต้องรวมกันเท่ากับจำนวน${pair.label}` },
						{ status: 400 },
					);
				}
			}
		}

		const { data, error } = await getSupabase()
			.from(TABLE)
			.update(body)
			.eq("id", id)
			.select()
			.single();
		if (error) return Response.json({ error: error.message }, { status: 400 });
		return Response.json({ data });
	} catch (error) {
		if (error instanceof SyntaxError) {
			return Response.json({ error: "รูปแบบ JSON ไม่ถูกต้อง" }, { status: 400 });
		}
		return (
			configurationError(error) ??
			Response.json({ error: "แก้ไขใบสมัครไม่สำเร็จ" }, { status: 500 })
		);
	}
}

export async function DELETE(request: Request) {
	const id = new URL(request.url).searchParams.get("id");
	if (!id)
		return Response.json(
			{ error: "กรุณาระบุ id ใน query parameter" },
			{ status: 400 },
		);

	try {
		const { data, error } = await getSupabase()
			.from(TABLE)
			.delete()
			.eq("id", id)
			.select()
			.single();
		if (error) return Response.json({ error: error.message }, { status: 400 });
		return Response.json({ data });
	} catch (error) {
		return (
			configurationError(error) ??
			Response.json({ error: "ลบใบสมัครไม่สำเร็จ" }, { status: 500 })
		);
	}
}
