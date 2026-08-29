-- CreateEnum
CREATE TYPE "ProjectImageType" AS ENUM ('image', 'gif', 'youtube');

-- DropIndex
DROP INDEX "Project_published_order_idx";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProjectImage" ADD COLUMN     "fitMode" TEXT NOT NULL DEFAULT 'cover',
ADD COLUMN     "type" "ProjectImageType" NOT NULL DEFAULT 'image';

-- CreateIndex
CREATE INDEX "Project_published_pinned_order_idx" ON "Project"("published", "pinned", "order");
