-- A project can now carry several categories, and they are no longer
-- translated per locale (see src/lib/categories.ts). MySQL has no scalar
-- list type, so they live in a JSON array on Project.

-- AlterTable: added nullable so the existing rows can be backfilled first.
ALTER TABLE `Project` ADD COLUMN `categories` JSON NULL;

-- Backfill: carry the current category over as a one-element array. The
-- English translation is the source — the new list is English-only and its
-- values already match what is stored there — with any other locale as a
-- fallback, so a project translated only into ru/uz still keeps its value.
UPDATE `Project` p
SET `categories` = COALESCE(
  (SELECT JSON_ARRAY(t.category) FROM `ProjectTranslation` t
    WHERE t.projectId = p.id AND t.locale = 'en' AND t.category IS NOT NULL AND t.category <> ''
    LIMIT 1),
  (SELECT JSON_ARRAY(t.category) FROM `ProjectTranslation` t
    WHERE t.projectId = p.id AND t.category IS NOT NULL AND t.category <> ''
    LIMIT 1),
  JSON_ARRAY()
);

ALTER TABLE `Project` MODIFY COLUMN `categories` JSON NOT NULL;

-- AlterTable: the per-locale category is replaced by Project.categories.
ALTER TABLE `ProjectTranslation` DROP COLUMN `category`;
