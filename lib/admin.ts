import "server-only";
import { and, asc, count, desc, eq, gt, inArray, lte, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { toPost, toRequest, toTeamMember } from "@/lib/db/mappers";
import { appointmentRequests, notifications, posts, users } from "@/lib/db/schema";
import type { AppointmentRequest, RequestAlert } from "@/lib/data/types";

export async function getAllPosts() {
  const rows = await getDb().select().from(posts).orderBy(desc(posts.updatedAt));
  return rows.map(toPost);
}

export async function getPostById(id: string) {
  const [row] = await getDb().select().from(posts).where(eq(posts.id, id)).limit(1);
  return row ? toPost(row) : null;
}

export async function countNewRequests() {
  const [row] = await getDb().select({ n: count() }).from(appointmentRequests).where(eq(appointmentRequests.status, "new"));
  return row?.n ?? 0;
}

export async function getRequestCounts() {
  const rows = await getDb()
    .select({ status: appointmentRequests.status, n: count() })
    .from(appointmentRequests)
    .groupBy(appointmentRequests.status);
  const counts = { new: 0, handled: 0, all: 0 };
  for (const { status, n } of rows) {
    counts[status] = n;
    counts.all += n;
  }
  return counts;
}

export const REQUESTS_PAGE_SIZE = 100;

export type RequestWithAlerts = AppointmentRequest & { alerts: RequestAlert[] };

/** Most recent requests first, with the WhatsApp alerts sent for each. */
export async function getRequests(status: AppointmentRequest["status"] | null): Promise<RequestWithAlerts[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(appointmentRequests)
    .where(status ? eq(appointmentRequests.status, status) : undefined)
    .orderBy(desc(appointmentRequests.createdAt))
    .limit(REQUESTS_PAGE_SIZE);
  if (rows.length === 0) return [];

  const alertRows = await db
    .select({
      requestId: notifications.requestId,
      recipientName: notifications.recipientName,
      status: notifications.status,
      error: notifications.error,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .where(inArray(notifications.requestId, rows.map((r) => r.id)))
    .orderBy(asc(notifications.createdAt));

  return rows.map((row) => ({
    ...toRequest(row),
    alerts: alertRows
      .filter((a) => a.requestId === row.id)
      .map((a) => ({ recipientName: a.recipientName, status: a.status, error: a.error, createdAt: a.createdAt.toISOString() })),
  }));
}

export async function getOverview() {
  const db = getDb();
  const live = and(eq(posts.status, "published"), lte(posts.publishedAt, sql`now()`));
  const scheduled = and(eq(posts.status, "published"), gt(posts.publishedAt, sql`now()`));
  const [[stats], newRequests, latestRequests, latestPosts] = await Promise.all([
    db
      .select({
        published: sql<number>`count(*) filter (where ${live})`.mapWith(Number),
        scheduled: sql<number>`count(*) filter (where ${scheduled})`.mapWith(Number),
        drafts: sql<number>`count(*) filter (where ${posts.status} = 'draft')`.mapWith(Number),
      })
      .from(posts),
    countNewRequests(),
    db.select().from(appointmentRequests).orderBy(desc(appointmentRequests.createdAt)).limit(4),
    db.select().from(posts).orderBy(desc(posts.updatedAt)).limit(4),
  ]);
  return {
    ...stats,
    newRequests,
    latestRequests: latestRequests.map(toRequest),
    latestPosts: latestPosts.map(toPost),
  };
}

export async function getTeam() {
  const rows = await getDb()
    .select()
    .from(users)
    .orderBy(
      desc(users.active),
      sql`case ${users.role} when 'admin' then 0 when 'editor' then 1 else 2 end`,
      asc(users.name),
    );
  return rows.map(toTeamMember);
}
