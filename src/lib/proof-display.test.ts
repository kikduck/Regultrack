import {
  pickActiveProofId,
  sortProofsNewestFirst,
  isProofValidityExpired,
} from "./proof-display";

const base = {
  file_name: "x.pdf",
  file_url: "https://example.com/x",
  file_hash: null as string | null,
  profiles: null as { full_name: string } | null,
};

describe("proof-display", () => {
  it("sortProofsNewestFirst orders by uploaded_at desc", () => {
    const a = {
      ...base,
      id: "1",
      uploaded_at: "2024-01-01T10:00:00Z",
      valid_from: null,
      valid_until: null,
    };
    const b = {
      ...base,
      id: "2",
      uploaded_at: "2025-01-01T10:00:00Z",
      valid_from: null,
      valid_until: null,
    };
    expect(sortProofsNewestFirst([a, b]).map((p) => p.id)).toEqual(["2", "1"]);
  });

  it("pickActiveProofId prefers proof whose valid_until matches obligation due_date", () => {
    const proofs = [
      {
        ...base,
        id: "old",
        uploaded_at: "2025-06-01T10:00:00Z",
        valid_from: null,
        valid_until: "2025-12-31",
      },
      {
        ...base,
        id: "current",
        uploaded_at: "2025-01-01T10:00:00Z",
        valid_from: null,
        valid_until: "2026-06-30",
      },
    ];
    expect(pickActiveProofId(proofs, "2026-06-30")).toBe("current");
  });

  it("pickActiveProofId falls back to newest upload when no due match", () => {
    const proofs = [
      {
        ...base,
        id: "a",
        uploaded_at: "2025-01-01T10:00:00Z",
        valid_from: null,
        valid_until: null,
      },
      {
        ...base,
        id: "b",
        uploaded_at: "2025-06-01T10:00:00Z",
        valid_from: null,
        valid_until: null,
      },
    ];
    expect(pickActiveProofId(proofs, "2026-01-01")).toBe("b");
  });

  it("isProofValidityExpired compares calendar dates", () => {
    expect(isProofValidityExpired("2020-01-01", "2026-01-15")).toBe(true);
    expect(isProofValidityExpired("2030-01-01", "2026-01-15")).toBe(false);
    expect(isProofValidityExpired(null, "2026-01-15")).toBe(false);
  });
});
