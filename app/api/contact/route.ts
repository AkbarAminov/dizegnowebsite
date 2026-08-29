import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { notifyEmail, notifyTelegram } from "@/lib/notifications";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  await prisma.contactMessage.create({ data: parsed.data });

  // Both channels no-op on their own if their env vars aren't set, so a
  // missing Telegram/email config never fails the submission itself.
  await Promise.all([notifyTelegram(parsed.data), notifyEmail(parsed.data)]);

  return NextResponse.json({ ok: true });
}
