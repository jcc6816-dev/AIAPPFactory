import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const CIPHER = "aes-256-gcm";

function getEncryptionKey() {
  const secret = process.env.AUTH_SECRET || "local-dev-auth-secret";
  return createHash("sha256").update(secret).digest();
}

export function encryptSecret(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return "";
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv(CIPHER, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(normalized, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

export function decryptSecret(value?: string) {
  if (!value) {
    return "";
  }

  const [ivText, tagText, encryptedText] = value.split(".");
  if (!ivText || !tagText || !encryptedText) {
    return "";
  }

  try {
    const decipher = createDecipheriv(
      CIPHER,
      getEncryptionKey(),
      Buffer.from(ivText, "base64")
    );
    decipher.setAuthTag(Buffer.from(tagText, "base64"));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, "base64")),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch (_error) {
    return "";
  }
}
