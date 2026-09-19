-- Categories become a managed list with a priority order: the admin can
-- reorder and delete them from the dropdown. Projects keep storing names
-- in Project.categories; this table is the vocabulary and its order.

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(40) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Category_name_key`(`name`),
    INDEX `Category_order_idx`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Backfill, keeping the order the dropdown showed until now: the former
-- built-in suggestions first, then every category already on a project,
-- alphabetically. INSERT IGNORE skips names that differ only in case.
INSERT INTO `Category` (`id`, `name`, `order`) VALUES
  (REPLACE(UUID(), '-', ''), 'Finance & Banking', 0),
  (REPLACE(UUID(), '-', ''), 'Automotive', 1),
  (REPLACE(UUID(), '-', ''), 'Food & Delivery', 2),
  (REPLACE(UUID(), '-', ''), 'Healthcare', 3),
  (REPLACE(UUID(), '-', ''), 'Retail', 4),
  (REPLACE(UUID(), '-', ''), 'Sport & Events', 5),
  (REPLACE(UUID(), '-', ''), 'Digital & Web', 6),
  (REPLACE(UUID(), '-', ''), 'Other', 7);

INSERT IGNORE INTO `Category` (`id`, `name`, `order`)
SELECT REPLACE(UUID(), '-', ''), used.name, 8 + ROW_NUMBER() OVER (ORDER BY used.name)
FROM (
  SELECT DISTINCT TRIM(jt.name) AS name
  FROM `Project` p,
    JSON_TABLE(p.`categories`, '$[*]' COLUMNS (name VARCHAR(40) PATH '$')) jt
  WHERE jt.name IS NOT NULL AND TRIM(jt.name) <> ''
) used;
