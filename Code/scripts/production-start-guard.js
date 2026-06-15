#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const appDir = path.resolve(__dirname, "..");
process.chdir(appDir);
process.env.NODE_ENV = process.env.NODE_ENV || "production";

function loadEnv() {
  try {
    const { loadEnvConfig } = require("@next/env");
    loadEnvConfig(appDir, process.env.NODE_ENV !== "production");
    return;
  } catch (error) {
    const envPath = path.join(appDir, ".env.local");
    if (!fs.existsSync(envPath)) return;

    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)?\s*$/);
      if (!match || line.trimStart().startsWith("#")) continue;

      const key = match[1];
      let value = (match[2] || "").trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

function assertRequiredEnv() {
  const required = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "AUTH_SECRET",
    "AUTH_URL",
    "NEXTAUTH_URL",
  ];

  if (process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true") {
    required.push("AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET");
  }

  if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
    required.push("NEXT_PUBLIC_WEB_URL");
  }

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length === 0) {
    console.log(
      `[startup-guard] Production environment check passed (${required.length} vars).`
    );
    return;
  }

  console.error(
    `[startup-guard] CRITICAL: missing production environment variables: ${missing.join(
      ", "
    )}`
  );
  console.error(
    "[startup-guard] Refusing to start. Check /app/aiform-factory/.env.local and restart with --update-env."
  );
  process.exit(1);
}

loadEnv();

if (process.env.NODE_ENV === "production") {
  assertRequiredEnv();
}

require(path.join(appDir, "server.js"));
