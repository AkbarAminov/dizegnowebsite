import { Prisma } from "@prisma/client";
import type { ZodType } from "zod";

// Small helpers shared by the /api/admin route handlers.

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

type Parsed<T> = { ok: true; data: T } | { ok: false; response: Response };

export async function parseBody<T>(request: Request, schema: ZodType<T>): Promise<Parsed<T>> {
  const body = await request.json().catch(() => null);
  const result = schema.safeParse(body);
  if (result.success) return { ok: true, data: result.data };

  const issue = result.error.issues[0];
  const message = issue ? `${issue.path.join(".") || "body"}: ${issue.message}` : "Invalid request body";
  return { ok: false, response: jsonError(message, 400) };
}

export function isUniqueViolation(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
