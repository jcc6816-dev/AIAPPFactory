const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function readEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match) continue;
    env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

function getKey(env) {
  if (!env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is required for webhook URL migration");
  }
  return crypto.createHash("sha256").update(env.AUTH_SECRET).digest();
}

function encrypt(value, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(value.trim(), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

function decrypt(value, key) {
  const [ivText, tagText, encryptedText] = String(value || "").split(".");
  if (!ivText || !tagText || !encryptedText) return "";
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(ivText, "base64")
  );
  decipher.setAuthTag(Buffer.from(tagText, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

async function requestSupabase(env, route, options = {}) {
  const baseUrl = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseUrl || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  const response = await fetch(`${baseUrl}/rest/v1/${route}`, {
    ...options,
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Supabase request failed with status ${response.status}`);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function main() {
  const env = {
    ...readEnvFile(path.join(__dirname, "..", ".env.local")),
    ...process.env,
  };
  const key = getKey(env);
  const apply = process.argv.includes("--apply");
  const clearPlaintext = process.argv.includes("--clear-plaintext");
  if (apply && clearPlaintext) {
    throw new Error("run --apply and --clear-plaintext as separate phases");
  }

  const rows = await requestSupabase(
    env,
    "forms?select=uuid,webhook_url,webhook_url_encrypted&webhook_url=neq."
  );
  const pending = (rows || []).filter(
    (row) => row.webhook_url && !row.webhook_url_encrypted
  );
  const verified = (rows || []).filter(
    (row) =>
      row.webhook_url &&
      row.webhook_url_encrypted &&
      decrypt(row.webhook_url_encrypted, key) === row.webhook_url
  );

  if (!apply && !clearPlaintext) {
    console.log(
      JSON.stringify(
        {
          action: "dry_run",
          plaintext_rows: (rows || []).length,
          pending_backfill: pending.length,
          verified_for_clear: verified.length,
        },
        null,
        2
      )
    );
    return;
  }

  if (apply) {
    for (const row of pending) {
      await requestSupabase(env, `forms?uuid=eq.${encodeURIComponent(row.uuid)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          webhook_url_encrypted: encrypt(row.webhook_url, key),
        }),
      });
    }
    console.log(JSON.stringify({ action: "backfilled", count: pending.length }));
    return;
  }

  if (verified.length !== (rows || []).length) {
    throw new Error("not every plaintext URL has a verified encrypted copy");
  }
  for (const row of verified) {
    await requestSupabase(env, `forms?uuid=eq.${encodeURIComponent(row.uuid)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ webhook_url: "" }),
    });
  }
  console.log(JSON.stringify({ action: "cleared_plaintext", count: verified.length }));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
