-- CreateTable
CREATE TABLE `ProjectTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `locale` ENUM('ru', 'en', 'uz') NOT NULL,
    `title` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `production` TEXT NULL,

    UNIQUE INDEX `ProjectTranslation_projectId_locale_key`(`projectId`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectTranslation` ADD CONSTRAINT `ProjectTranslation_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: existing Project copy is English-only content, so it becomes
-- the "en" translation row; "ru"/"uz" start empty and are filled in later
-- from the admin's new language tabs. toProject() falls back to "en" for
-- any locale that hasn't been translated yet.
INSERT INTO `ProjectTranslation` (`id`, `projectId`, `locale`, `title`, `category`, `description`, `production`)
SELECT UUID(), `id`, 'en', `title`, `category`, `description`, `production`
FROM `Project`;

-- AlterTable: title/category/description/production now live in ProjectTranslation
ALTER TABLE `Project` DROP COLUMN `title`,
                       DROP COLUMN `category`,
                       DROP COLUMN `description`,
                       DROP COLUMN `production`;

-- AlterTable: ProjectField label/value become a per-locale JSON blob
ALTER TABLE `ProjectField` ADD COLUMN `translations` JSON NULL;

UPDATE `ProjectField`
SET `translations` = JSON_OBJECT('en', JSON_OBJECT('label', `label`, 'value', `value`));

ALTER TABLE `ProjectField` MODIFY COLUMN `translations` JSON NOT NULL;

ALTER TABLE `ProjectField` DROP COLUMN `label`,
                            DROP COLUMN `value`;
