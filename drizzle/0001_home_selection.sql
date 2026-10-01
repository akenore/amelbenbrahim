DROP INDEX "posts_single_featured";--> statement-breakpoint
CREATE INDEX "posts_home_idx" ON "posts" USING btree ("featured","published_at" DESC NULLS LAST);--> statement-breakpoint
-- "À la une" now decides what the home page shows. Keep the three latest published
-- articles there, as before, when the practice had not chosen more than one.
UPDATE "posts" SET "featured" = true
WHERE (SELECT count(*) FROM "posts" WHERE "featured") <= 1
  AND "id" IN (
    SELECT "id" FROM "posts"
    WHERE "status" = 'published' AND "published_at" <= now()
    ORDER BY "published_at" DESC
    LIMIT 3
  );
