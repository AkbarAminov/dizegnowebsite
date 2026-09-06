import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/api";
import { orderSchema } from "@/lib/validation";
import { revalidatePublicSite } from "@/lib/projects";

export async function PATCH(request: Request) {
  const parsed = await parseBody(request, orderSchema);
  if (!parsed.ok) return parsed.response;

  await prisma.$transaction(
    parsed.data.order.map((id, order) => prisma.project.updateMany({ where: { id }, data: { order } }))
  );

  revalidatePublicSite();
  return Response.json({ ok: true });
}
