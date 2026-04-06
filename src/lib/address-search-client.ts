export type AddressSuggestion = { id: string; label: string };

export async function fetchAddressSuggestions(
  query: string,
  signal?: AbortSignal
): Promise<AddressSuggestion[]> {
  const q = query.trim();
  if (q.length < 3) return [];
  const res = await fetch(
    `/api/address-search?q=${encodeURIComponent(q)}`,
    { signal }
  );
  if (!res.ok) return [];
  const data = (await res.json()) as { suggestions?: AddressSuggestion[] };
  return Array.isArray(data.suggestions) ? data.suggestions : [];
}
