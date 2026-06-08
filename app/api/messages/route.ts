import { NextResponse, type NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isAdminAuthenticatedRequest } from "@/lib/admin-auth";

const MESSAGES_FILE = path.join(process.cwd(), "data", "messages.json");

async function readMessages() {
  try {
    const raw = await fs.readFile(MESSAGES_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    return [];
  }
}

async function writeMessages(messages: unknown[]) {
  await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf8");
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticatedRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await readMessages();
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("[api/messages GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { name?: string; email?: string; phone?: string; message?: string }
      | null;

    const name = body?.name?.trim() || "Anonim";
    const email = body?.email?.trim() || "";
    const phone = body?.phone?.trim() || "";
    const message = body?.message?.trim() || "";

    if (!message) {
      return NextResponse.json({ error: "Mesajul este obligatoriu." }, { status: 400 });
    }

    const messages = await readMessages();
    const newMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name,
      email,
      phone,
      message,
      createdAt: new Date().toISOString(),
    };

    messages.unshift(newMessage);
    // keep last 100 messages
    const limited = messages.slice(0, 100);
    await writeMessages(limited);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/messages POST]", error);
    return NextResponse.json({ error: "Nu s-a putut trimite mesajul." }, { status: 500 });
  }
}
