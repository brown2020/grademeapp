const STORAGE_HOST = "firebasestorage.googleapis.com";

/** Largest upload the parser will fetch; matches storage.rules. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * SSRF guard for document parsing: only HTTPS Firebase Storage download URLs
 * for the configured bucket and the caller's own `uploads/{uid}/` folder.
 */
export function isOwnUploadUrl(urlString: string, uid: string, bucket: string | undefined): boolean {
  if (!uid || !bucket) return false;
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.hostname !== STORAGE_HOST || url.port) return false;

  const match = /^\/v0\/b\/([^/]+)\/o\/([^/]+)$/.exec(url.pathname);
  if (!match || decodeURIComponent(match[1]) !== bucket) return false;

  let objectPath: string;
  try {
    objectPath = decodeURIComponent(match[2]);
  } catch {
    return false;
  }
  const prefix = `uploads/${uid}/`;
  return objectPath.startsWith(prefix) && !objectPath.slice(prefix.length).split("/").includes("..");
}
