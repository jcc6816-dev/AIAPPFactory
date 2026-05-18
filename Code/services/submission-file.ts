import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { FormRecord, StoredFileAsset, SubmissionFileValue } from "@/types/form";
import { newStorage } from "@/lib/storage";
import { getIsoTimestr } from "@/lib/time";
import { getUniSeq } from "@/lib/hash";

interface IncomingSubmissionFile {
  field_key: string;
  file: File;
}

interface PersistedSubmissionFiles {
  files: SubmissionFileValue[];
  storageFiles: StoredFileAsset[];
}

function hasObjectStorageConfig() {
  return Boolean(
    process.env.STORAGE_ENDPOINT &&
      process.env.STORAGE_ACCESS_KEY &&
      process.env.STORAGE_SECRET_KEY &&
      process.env.STORAGE_BUCKET
  );
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function persistToLocalDisk(
  form: FormRecord,
  incomingFiles: IncomingSubmissionFile[]
): Promise<PersistedSubmissionFiles> {
  const uploadDir = path.join(process.cwd(), "data", "uploads", form.uuid);
  await mkdir(uploadDir, { recursive: true });

  const files: SubmissionFileValue[] = [];
  const storageFiles: StoredFileAsset[] = [];

  for (const incoming of incomingFiles) {
    const bytes = await incoming.file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const storedFileName = `${getUniSeq("file_")}_${sanitizeFileName(
      incoming.file.name
    )}`;
    const storedPath = path.join(uploadDir, storedFileName);

    await writeFile(storedPath, buffer);

    files.push({
      field_key: incoming.field_key,
      file_name: incoming.file.name,
      file_size: incoming.file.size,
      file_type: incoming.file.type,
    });

    storageFiles.push({
      field_key: incoming.field_key,
      file_name: incoming.file.name,
      file_path: storedPath,
      file_url: "",
      mime_type: incoming.file.type,
      file_size: incoming.file.size,
      storage_provider: "local",
      storage_bucket: "local",
      uploaded_at: getIsoTimestr(),
    });
  }

  return {
    files,
    storageFiles,
  };
}

async function persistToObjectStorage(
  form: FormRecord,
  incomingFiles: IncomingSubmissionFile[]
): Promise<PersistedSubmissionFiles> {
  const storage = newStorage();
  const files: SubmissionFileValue[] = [];
  const storageFiles: StoredFileAsset[] = [];

  for (const incoming of incomingFiles) {
    const bytes = await incoming.file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const key = [
      "form-submissions",
      form.uuid,
      `${getUniSeq("asset_")}_${sanitizeFileName(incoming.file.name)}`,
    ].join("/");
    const upload = await storage.uploadFile({
      body: buffer,
      key,
      contentType: incoming.file.type || "application/octet-stream",
    });

    files.push({
      field_key: incoming.field_key,
      file_name: incoming.file.name,
      file_size: incoming.file.size,
      file_type: incoming.file.type,
    });

    storageFiles.push({
      field_key: incoming.field_key,
      file_name: incoming.file.name,
      file_path: upload.key || key,
      file_url: upload.url || upload.location || "",
      mime_type: incoming.file.type,
      file_size: incoming.file.size,
      storage_provider: "s3",
      storage_bucket: upload.bucket || process.env.STORAGE_BUCKET || "",
      uploaded_at: getIsoTimestr(),
    });
  }

  return {
    files,
    storageFiles,
  };
}

export async function persistSubmissionFiles(
  form: FormRecord,
  incomingFiles: IncomingSubmissionFile[]
): Promise<PersistedSubmissionFiles> {
  if (incomingFiles.length === 0) {
    return {
      files: [],
      storageFiles: [],
    };
  }

  if (hasObjectStorageConfig()) {
    return persistToObjectStorage(form, incomingFiles);
  }

  return persistToLocalDisk(form, incomingFiles);
}
