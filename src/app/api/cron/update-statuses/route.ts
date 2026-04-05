import { createAdminClient } from "@/lib/supabase/admin";
import {
  statusFromDueDateAndAlerts,
} from "@/lib/obligation-status";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: rows, error: fetchError } = await supabase
    .from("obligations")
    .select(
      "id, status, due_date, obligation_templates(alert_days)"
    )
    .not("due_date", "is", null);

  if (fetchError) {
    return NextResponse.json(
      { error: fetchError.message },
      { status: 500 }
    );
  }

  const expiredIds: string[] = [];
  const expiringIds: string[] = [];
  const validIds: string[] = [];

  for (const row of rows || []) {
    if (row.status === "missing") continue;

    const template = row.obligation_templates as unknown as {
      alert_days: number[];
    } | null;

    const due = row.due_date as string;
    const next = statusFromDueDateAndAlerts(
      due,
      template?.alert_days,
      today
    );

    if (next === row.status) continue;

    if (next === "expired") expiredIds.push(row.id);
    else if (next === "expiring_soon") expiringIds.push(row.id);
    else validIds.push(row.id);
  }

  const counts = { expired: 0, expiring_soon: 0, valid: 0 };

  if (expiredIds.length > 0) {
    const { data } = await supabase
      .from("obligations")
      .update({ status: "expired" })
      .in("id", expiredIds)
      .select("id");
    counts.expired = data?.length ?? 0;
  }

  if (expiringIds.length > 0) {
    const { data } = await supabase
      .from("obligations")
      .update({ status: "expiring_soon" })
      .in("id", expiringIds)
      .select("id");
    counts.expiring_soon = data?.length ?? 0;
  }

  if (validIds.length > 0) {
    const { data } = await supabase
      .from("obligations")
      .update({ status: "valid" })
      .in("id", validIds)
      .select("id");
    counts.valid = data?.length ?? 0;
  }

  return NextResponse.json({
    updated: counts,
    date: today,
    evaluated: rows?.length ?? 0,
  });
}
