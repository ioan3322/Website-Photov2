import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken, validateAdminCredentials } from "@/lib/admin-auth";

type LoginBody = {
	username?: string;
	password?: string;
};

export async function POST(request: Request) {
	try {
		const body = (await request.json().catch(() => null)) as LoginBody | null;
		const username = body?.username?.trim() || "";
		const password = body?.password ?? "";

		if (!username || !password) {
			return NextResponse.json({ error: "Utilizatorul și parola sunt obligatorii." }, { status: 400 });
		}

		if (!validateAdminCredentials(username, password)) {
			return NextResponse.json({ error: "Credențiale invalide." }, { status: 401 });
		}

		const response = NextResponse.json({ ok: true });
		response.cookies.set({
			name: ADMIN_SESSION_COOKIE,
			value: createAdminSessionToken(username),
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60 * 12,
		});

		return response;
	} catch (error) {
		console.error("[admin/login] Failed to authenticate admin", error);
		return NextResponse.json({ error: "Nu s-a putut realiza autentificarea." }, { status: 500 });
	}
}
