import { prisma } from "@/lib/prisma";
import { jsonError, parseBody } from "@/lib/api";
import { readSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/messages/[id]">) {
  const { id } = await params;
  const parsed = await parseBody(request, readSchema);
  if (!parsed.ok) return parsed.response;

  const { count } = await prisma.contactMessage.updateMany({ where: { id }, data: parsed.data });
  if (count === 0) return jsonError("Message not found", 404);
  return Response.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: RouteContext<"/api/admin/messages/[id]">) {
  const { id } = await params;
  const { count } = await prisma.contactMessage.deleteMany({ where: { id } });
  if (count === 0) return jsonError("Message not found", 404);
  return Response.json({ ok: true });
}
