export function resolvePublicApiBase(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/$/, "");
<<<<<<< codex/explain-502-bad-gateway-error-9ltnvr
  return configured || "";
=======
  if (configured) return configured;

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8000";
    }
  }

  return "";
>>>>>>> main
}

export function toPublicApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = resolvePublicApiBase();
  return base ? `${base}${normalizedPath}` : normalizedPath;
}
