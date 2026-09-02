import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { notifyContact } from "@/lib/notifications";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", fieldErrors: z.flattenError(parsed.error).fieldErrors },
      { status: 400 }
    );
  }

  await prisma.contactMessage.create({ data: parsed.data });
  await notifyContact(parsed.data);

  return Response.json({ ok: true });
}
