/** How long a Storage upload may sit with no progress before we cancel it. */
export const UPLOAD_STALL_MS = 20_000;

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  txt: "text/plain",
  pdf: "application/pdf",
  rtf: "application/rtf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  odt: "application/vnd.oasis.opendocument.text",
};

const ALLOWED_CONTENT_TYPES = new Set(Object.values(CONTENT_TYPE_BY_EXTENSION));

/**
 * Content type Storage rules accept. Browsers often label a .txt file
 * `text/plain;charset=UTF-8`, which is not an exact match for `text/plain`.
 * Returns null when the file is not one of the uploadable formats.
 */
export function uploadContentType(fileName: string, browserType: string): string | null {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  const fromName = CONTENT_TYPE_BY_EXTENSION[extension];
  if (fromName) return fromName;
  const base = browserType.split(";")[0]?.trim().toLowerCase() ?? "";
  return ALLOWED_CONTENT_TYPES.has(base) ? base : null;
}

/** One path segment. A slash would miss the `uploads/{uid}/{fileName}` rule. */
export function storageObjectName(fileName: string): string {
  const base = fileName.split(/[/\\]/).pop()?.trim() ?? "";
  if (!base || base === "." || base === "..") return "draft.txt";
  return base;
}

export type UploadTaskLike = {
  cancel: () => void;
  on: (
    event: "state_changed",
    onProgress: (snapshot: { bytesTransferred: number }) => void,
    onError: (error: unknown) => void,
    onComplete: () => void,
  ) => unknown;
};

/**
 * Resolves when the upload task completes. `uploadBytes` retries for 10 minutes
 * and does not abort an XHR that never fires load or error, so a stalled task
 * leaves the button on "Uploading…". Cancel once bytes stop moving.
 */
export function waitForUpload(task: UploadTaskLike, stallMs = UPLOAD_STALL_MS): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let seen = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const finish = (settle: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      settle();
    };
    const fail = () => {
      try {
        task.cancel();
      } catch {
        // Cancel is best-effort. The deadline still rejects.
      }
      finish(() => reject(new Error("The upload took too long. Check your connection and try again.")));
    };
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(fail, stallMs);
    };
    arm();
    task.on(
      "state_changed",
      (snapshot) => {
        if (snapshot.bytesTransferred > seen) {
          seen = snapshot.bytesTransferred;
          arm();
        }
      },
      (error) => finish(() => reject(error)),
      () => finish(() => resolve()),
    );
  });
}

export function withDeadline<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export function uploadErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.startsWith("The upload took too long")) return error.message;
  const code =
    typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
  if (code === "storage/unauthorized") return "You don't have permission to upload that file.";
  if (code === "storage/unauthenticated") return "Please sign in again, then retry the upload.";
  if (code === "storage/canceled" || code === "storage/retry-limit-exceeded") {
    return "The upload took too long. Check your connection and try again.";
  }
  return "Failed to upload file. Please try again.";
}
