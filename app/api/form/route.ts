import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
	if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
		return NextResponse.json(
			{ error: "Supabase environment variables not configured in .env.local" },
			{ status: 500 },
		);
	}

	// shortcut: assumes table name is 'forms', customize to your schema
	const { data, error } = await supabase.from("forms").select("*");

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}

	return NextResponse.json({ data });
}

export async function POST(request: Request) {
	if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
		return NextResponse.json(
			{ error: "Supabase environment variables not configured in .env.local" },
			{ status: 500 },
		);
	}

	try {
		const body = await request.json();
		// shortcut: assumes table name is 'forms', customize to your schema
		const { data, error } = await supabase
			.from("forms")
			.insert([body])
			.select();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json({ data }, { status: 201 });
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}
}
