export function extractBrandFromDrawerUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const domain = parsed.searchParams.get("domain"); // e.g. "www.victoriabeckham.com"
    if (!domain) return "unknown-brand";

    // "www.victoriabeckham.com" -> "victoriabeckham"
    return domain
      .replace(/^www\./, "")
      .split(".")[0]
      .toLowerCase();
  } catch {
    return "unknown-brand";
  }
}