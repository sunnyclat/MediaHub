START TRANSACTION;

DROP TEMPORARY TABLE IF EXISTS duplicate_content_map;

CREATE TEMPORARY TABLE duplicate_content_map AS
SELECT
  c.id AS remove_id,
  d.keep_id
FROM content c
JOIN (
  SELECT
    LOWER(TRIM(title)) AS normalized_title,
    type,
    release_year,
    MIN(id) AS keep_id,
    COUNT(*) AS total_rows
  FROM content
  GROUP BY LOWER(TRIM(title)), type, release_year
  HAVING COUNT(*) > 1
) d
  ON LOWER(TRIM(c.title)) = d.normalized_title
 AND c.type = d.type
 AND c.release_year = d.release_year
WHERE c.id <> d.keep_id;

SELECT
  c_keep.id AS keep_id,
  c_keep.title,
  c_keep.type,
  c_keep.release_year,
  GROUP_CONCAT(c_dup.id ORDER BY c_dup.id) AS duplicate_ids,
  COUNT(*) AS duplicates_to_remove
FROM duplicate_content_map m
JOIN content c_keep ON c_keep.id = m.keep_id
JOIN content c_dup ON c_dup.id = m.remove_id
GROUP BY c_keep.id, c_keep.title, c_keep.type, c_keep.release_year
ORDER BY c_keep.title, c_keep.type, c_keep.release_year;

SET @has_content_likes := (
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_schema = DATABASE() AND table_name = 'content_likes'
);

SET @sql := IF(
  @has_content_likes > 0,
  'INSERT INTO content_likes (content_id, user_id)
   SELECT DISTINCT m.keep_id, cl.user_id
   FROM content_likes cl
   JOIN duplicate_content_map m ON m.remove_id = cl.content_id
   LEFT JOIN content_likes existing
     ON existing.content_id = m.keep_id
    AND existing.user_id = cl.user_id
   WHERE existing.content_id IS NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
  @has_content_likes > 0,
  'DELETE cl
   FROM content_likes cl
   JOIN duplicate_content_map m ON m.remove_id = cl.content_id',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_saved_content := (
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_schema = DATABASE() AND table_name = 'saved_content'
);

SET @sql := IF(
  @has_saved_content > 0,
  'INSERT INTO saved_content (user_id, content_id)
   SELECT DISTINCT sc.user_id, m.keep_id
   FROM saved_content sc
   JOIN duplicate_content_map m ON m.remove_id = sc.content_id
   LEFT JOIN saved_content existing
     ON existing.user_id = sc.user_id
    AND existing.content_id = m.keep_id
   WHERE existing.user_id IS NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
  @has_saved_content > 0,
  'DELETE sc
   FROM saved_content sc
   JOIN duplicate_content_map m ON m.remove_id = sc.content_id',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_content_genres := (
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_schema = DATABASE() AND table_name = 'content_genres'
);

SET @sql := IF(
  @has_content_genres > 0,
  'INSERT INTO content_genres (content_id, genre_id)
   SELECT DISTINCT m.keep_id, cg.genre_id
   FROM content_genres cg
   JOIN duplicate_content_map m ON m.remove_id = cg.content_id
   LEFT JOIN content_genres existing
     ON existing.content_id = m.keep_id
    AND existing.genre_id = cg.genre_id
   WHERE existing.content_id IS NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
  @has_content_genres > 0,
  'DELETE cg
   FROM content_genres cg
   JOIN duplicate_content_map m ON m.remove_id = cg.content_id',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_content_platforms := (
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_schema = DATABASE() AND table_name = 'content_platforms'
);

SET @sql := IF(
  @has_content_platforms > 0,
  'INSERT INTO content_platforms (content_id, platform_id)
   SELECT DISTINCT m.keep_id, cp.platform_id
   FROM content_platforms cp
   JOIN duplicate_content_map m ON m.remove_id = cp.content_id
   LEFT JOIN content_platforms existing
     ON existing.content_id = m.keep_id
    AND existing.platform_id = cp.platform_id
   WHERE existing.content_id IS NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
  @has_content_platforms > 0,
  'DELETE cp
   FROM content_platforms cp
   JOIN duplicate_content_map m ON m.remove_id = cp.content_id',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

DELETE c
FROM content c
JOIN duplicate_content_map m ON m.remove_id = c.id;

SELECT ROW_COUNT() AS deleted_duplicate_rows;

COMMIT;
