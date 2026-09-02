import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/api";
import { orderSchema } from "@/lib/validation";
import { revalidatePublicSite } from "@/lib/projects";

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/projects/[id]/images/reorder">) {
  const { id } = await params;
  const parsed = await parseBody(request, orderSchema);
  if (!parsed.ok) return parsed.response;

  await prisma.$transaction(
    parsed.data.order.map((imageId, order) =>
      prisma.projectImage.updateMany({ where: { id: imageId, projectId: id }, data: { order } })
    )
  );

  revalidatePublicSite();
  return Response.json({ ok: true });
}
