function readRawDatabaseUrl() {
  return (process.env.DATABASE_URL || process.env.DIRECT_URL || "")
    .trim()
    .replace(/\r?\n/g, "")
    .replace(/^["']+|["']+$/g, "");
}

export function sanitizeDatabaseUrl(raw: string, onVercel = Boolean(process.env.VERCEL)) {
  const url = raw
    .trim()
    .replace(/\r?\n/g, "")
    .replace(/^["']+|["']+$/g, "");

  if (!url) {
    throw new Error(
      "DATABASE_URL이 없습니다. Vercel Environment Variables에 Neon pooled 연결 문자열을 넣으세요.",
    );
  }
  if (!url.startsWith("postgres")) {
    throw new Error(
      "DATABASE_URL은 postgresql:// 로 시작해야 합니다. Neon Connect에서 Connection string을 다시 복사하세요.",
    );
  }

  const q = url.indexOf("?");
  const base = q === -1 ? url : url.slice(0, q);
  const qs = q === -1 ? "" : url.slice(q + 1);
  const params = new URLSearchParams(qs);

  for (const key of [...params.keys()]) {
    const lower = key.toLowerCase();
    if (lower === "channel_binding" || lower === "pgbouncer" || lower === "connection_limit") {
      params.delete(key);
    }
  }

  if (!params.get("sslmode")) {
    params.set("sslmode", "require");
  }
  if (base.includes("-pooler")) {
    params.set("pgbouncer", "true");
  }
  params.set("connect_timeout", "30");
  if (onVercel) {
    params.set("connection_limit", "1");
  }

  return `${base}?${params.toString()}`;
}

export function getDatabaseUrl() {
  return sanitizeDatabaseUrl(readRawDatabaseUrl());
}

export function describeDatabaseTarget() {
  try {
    const parsed = new URL(getDatabaseUrl());
    const user = decodeURIComponent(parsed.username);
    const pooled = parsed.hostname.includes("-pooler");
    return `host=${parsed.hostname}, user=${user || "(없음)"}, pooled=${pooled ? "yes" : "no"}`;
  } catch {
    const raw = readRawDatabaseUrl();
    if (!raw) return "DATABASE_URL 없음";
    return "DATABASE_URL 형식이 잘못됨";
  }
}
