import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BAN_SEARCH = "https://api-adresse.data.gouv.fr/search/";

type AddressSuggestion = { id: string; label: string };

type BanSearchResponse = {
  features?: Array<{
    properties?: {
      id?: string | number;
      label?: string;
    };
  }>;
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) {
    return NextResponse.json({ suggestions: [] as AddressSuggestion[] });
  }

  const url = new URL(BAN_SEARCH);
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "8");

  let upstream: Response;
  try {
    upstream = await fetch(url, { headers: { Accept: "application/json" } });
  } catch {
    return NextResponse.json(
      { error: "Service d’adresses indisponible" },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Service d’adresses indisponible" },
      { status: 502 }
    );
  }

  const data = (await upstream.json()) as BanSearchResponse;
  const features = data.features ?? [];
  const suggestions: AddressSuggestion[] = features
    .map((f, i) => {
      const label = f.properties?.label;
      if (!label) return null;
      const id =
        f.properties?.id != null
          ? String(f.properties.id)
          : `ban-${i}-${label}`;
      return { id, label };
    })
    .filter((s): s is AddressSuggestion => s !== null);

  return NextResponse.json({ suggestions });
}
