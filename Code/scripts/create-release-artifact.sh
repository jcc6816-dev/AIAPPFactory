#!/bin/bash

# Build a Linux-safe, self-contained candidate release artifact. It packages
# only the Next standalone output, public assets and production startup files;
# local env files, runtime data and Playwright caches are deliberately excluded.
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
REPO_DIR="$(dirname "$APP_DIR")"

cd "$APP_DIR"

RELEASE_ID="${RELEASE_ID:-$(git -C "$REPO_DIR" rev-parse HEAD)}"
OUTPUT_DIR="${RELEASE_ARTIFACT_DIR:-$REPO_DIR/.release-artifacts}"

case "$RELEASE_ID" in
  *[!0-9a-f]*|"")
    echo "RELEASE_ID must be a lowercase Git SHA."
    exit 2
    ;;
esac

test -f ".next/standalone/server.js"
test -d ".next/static"
test -f "ecosystem.config.cjs"
test -f "scripts/production-start-guard.js"

mkdir -p "$OUTPUT_DIR"
STAGE_DIR="$(mktemp -d "$OUTPUT_DIR/.stage.XXXXXX")"
trap 'rm -rf "$STAGE_DIR"' EXIT

APP_STAGE="$STAGE_DIR/app"
mkdir -p "$APP_STAGE/.next"
cp -R ".next/standalone/." "$APP_STAGE/"
cp -R ".next/static" "$APP_STAGE/.next/static"

if [ -d "public" ]; then
  cp -R "public" "$APP_STAGE/public"
fi

mkdir -p "$APP_STAGE/scripts"
cp "ecosystem.config.cjs" "$APP_STAGE/ecosystem.config.cjs"
cp "scripts/production-start-guard.js" "$APP_STAGE/scripts/production-start-guard.js"

# Next standalone tracing can copy development fallback data and uploads because
# they are referenced by local-only code paths. Production mounts persistent
# storage and environment outside the release, so neither belongs in an
# immutable artifact.
rm -rf "$APP_STAGE/data"
find "$APP_STAGE" -type f \( -name '.env' -o -name '.env.*' \) -delete

# Never allow local credentials or mutable runtime state into a release.
if [ -d "$APP_STAGE/data" ] || find "$APP_STAGE" \( -name '.env' -o -name '.env.*' \) -print -quit | grep -q .; then
  echo "Release staging unexpectedly contains env files or runtime data."
  exit 1
fi

SHORT_ID="${RELEASE_ID:0:12}"
ARCHIVE_NAME="genforms-${SHORT_ID}-linux.tar.gz"
MANIFEST_NAME="release-${SHORT_ID}.manifest.json"
ARCHIVE_PATH="$OUTPUT_DIR/$ARCHIVE_NAME"
MANIFEST_PATH="$OUTPUT_DIR/$MANIFEST_NAME"

rm -f "$ARCHIVE_PATH" "$MANIFEST_PATH"
# macOS ships bsdtar, whose `--no-xattrs` option is not portable. Disabling
# copyfile metadata before creating a standard PAX archive keeps the archive
# readable by GNU tar on the Linux release host without Apple xattr headers.
COPYFILE_DISABLE=1 COPY_EXTENDED_ATTRIBUTES_DISABLE=1 \
  tar --format pax -czf "$ARCHIVE_PATH" -C "$STAGE_DIR" app

tar -tzf "$ARCHIVE_PATH" >/dev/null
if gzip -dc "$ARCHIVE_PATH" | strings | grep -E -q 'LIBARCHIVE\.xattr|SCHILY\.xattr'; then
  echo "Release archive contains platform-specific xattr headers."
  exit 1
fi
ARCHIVE_SHA="$(shasum -a 256 "$ARCHIVE_PATH" | awk '{print $1}')"
ARCHIVE_BYTES="$(wc -c < "$ARCHIVE_PATH" | tr -d ' ')"

node - "$MANIFEST_PATH" "$RELEASE_ID" "$ARCHIVE_NAME" "$ARCHIVE_SHA" "$ARCHIVE_BYTES" <<'NODE'
const fs = require("fs");
const [manifestPath, gitSha, archive, sha256, bytes] = process.argv.slice(2);
fs.writeFileSync(
  manifestPath,
  `${JSON.stringify({
    schemaVersion: 1,
    app: "genforms",
    gitSha,
    archive,
    sha256,
    bytes: Number(bytes),
    platform: "linux",
    contents: "next-standalone+public+production-guard",
    generatedAt: new Date().toISOString(),
  }, null, 2)}\n`,
  { mode: 0o600 },
);
NODE

echo "release_id=$RELEASE_ID"
echo "archive=$ARCHIVE_PATH"
echo "manifest=$MANIFEST_PATH"
echo "sha256=$ARCHIVE_SHA"
echo "bytes=$ARCHIVE_BYTES"
