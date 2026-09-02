import { prisma } from "@/lib/prisma";
import { jsonError, parseBody } from "@/lib/api";
import { youtubeSchema } from "@/lib/validation";
import { revalidatePublicSite } from "@/lib/projects";
import { parseYoutubeId, youtubeEmbedUrl } from "@/lib/youtube";

export async function POST(request: Request, { params }: RouteContext<"/api/admin/projects/[id]/images/youtube">) {
  const { id } = await params;
  const parsed = await parseBody(request, youtubeSchema);
  if (!parsed.ok) return parsed.response;

  const videoId = parseYoutubeId(parsed.data.url);
  if (!videoId) return jsonError("Not a recognizable YouTube URL", 400);

  const project = await prisma.project.findUnique({ where: { id }, select: { _count: { select: { images: true } } } });
  if (!project) return jsonError("Project not found", 404);

  const image = await prisma.projectImage.create({
    data: {
      projectId: id,
      url: youtubeEmbedUrl(videoId),
      // A video has no intrinsic size; 16:9 keeps the row consistent.
      width: 1280,
      height: 720,
      order: project._count.images,
      type: "youtube",
    },
  });

  revalidatePublicSite();
  return Response.json(image, { status: 201 });
}
