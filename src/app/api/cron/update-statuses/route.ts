import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];
  const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const { data: expired } = await supabase
    .from("obligations")
    .update({ status: "expired" })
    .lt("due_date", today)
    .neq("status", "expired")
    .not("due_date", "is", null)
    .select("id");

  const { data: expiring } = await supabase
    .from("obligations")
    .update({ status: "expiring_soon" })
    .gte("due_date", today)
    .lte("due_date", in30Days)
    .neq("status", "expiring_soon")
    .not("due_date", "is", null)
    .select("id");

  const { data: valid } = await supabase
    .from("obligations")
    .update({ status: "valid" })
    .gt("due_date", in30Days)
    .neq("status", "valid")
    .not("due_date", "is", null)
    .select("id");

  return NextResponse.json({
    updated: {
      expired: expired?.length || 0,
      expiring_soon: expiring?.length || 0,
      valid: valid?.length || 0,
    },
    date: today,
  });
}
