/**
 * Empreinte SHA-256 du fichier (Web Crypto), hex minuscule 64 caractères.
 */
export async function sha256HexFromFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
