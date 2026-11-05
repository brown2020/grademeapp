import { afterEach, describe, expect, it, vi } from "vitest";
import {
  storageObjectName,
  uploadContentType,
  uploadErrorMessage,
  waitForUpload,
  withDeadline,
  type UploadTaskLike,
} from "./uploadFile";

function fakeTask() {
  let onProgress: (snapshot: { bytesTransferred: number }) => void = () => {};
  let onError: (error: unknown) => void = () => {};
  let onComplete: () => void = () => {};
  const task: UploadTaskLike = {
    cancel: vi.fn(),
    on: (_event, progress, error, complete) => {
      onProgress = progress;
      onError = error;
      onComplete = complete;
    },
  };
  return {
    task,
    progress: (bytesTransferred: number) => onProgress({ bytesTransferred }),
    fail: (error: unknown) => onError(error),
    succeed: () => onComplete(),
  };
}

describe("uploadContentType", () => {
  it("maps a txt file to text/plain even when the browser appends a charset", () => {
    expect(uploadContentType("notes.TXT", "text/plain;charset=UTF-8")).toBe("text/plain");
    expect(uploadContentType("notes.txt", "")).toBe("text/plain");
  });

  it("keeps the other allow-listed document types", () => {
    expect(uploadContentType("essay.pdf", "application/pdf")).toBe("application/pdf");
    expect(uploadContentType("essay.docx", "")).toBe(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    expect(uploadContentType("essay.odt", "")).toBe("application/vnd.oasis.opendocument.text");
    expect(uploadContentType("essay.rtf", "application/rtf")).toBe("application/rtf");
  });

  it("rejects types the storage rules do not allow", () => {
    expect(uploadContentType("page.html", "text/html")).toBeNull();
    expect(uploadContentType("image.png", "image/png")).toBeNull();
  });
});

describe("storageObjectName", () => {
  it("keeps a single path segment", () => {
    expect(storageObjectName("my draft.txt")).toBe("my draft.txt");
    expect(storageObjectName("folder/my draft.txt")).toBe("my draft.txt");
    expect(storageObjectName("..")).toBe("draft.txt");
  });
});

describe("waitForUpload", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves when the task completes", async () => {
    const upload = fakeTask();
    const pending = waitForUpload(upload.task, 20_000);
    upload.succeed();
    await pending;
    expect(upload.task.cancel).not.toHaveBeenCalled();
  });

  it("rejects with the storage error and does not cancel", async () => {
    const upload = fakeTask();
    const pending = waitForUpload(upload.task, 20_000);
    const failure = Object.assign(new Error("denied"), { code: "storage/unauthorized" });
    upload.fail(failure);
    await expect(pending).rejects.toBe(failure);
    expect(upload.task.cancel).not.toHaveBeenCalled();
  });

  it("cancels a task that never moves bytes", async () => {
    vi.useFakeTimers();
    const upload = fakeTask();
    const pending = waitForUpload(upload.task, 20_000);
    const assertion = expect(pending).rejects.toThrow(/took too long/);
    await vi.advanceTimersByTimeAsync(20_000);
    await assertion;
    expect(upload.task.cancel).toHaveBeenCalledOnce();
  });

  it("extends the deadline while bytes are still arriving", async () => {
    vi.useFakeTimers();
    const upload = fakeTask();
    const pending = waitForUpload(upload.task, 20_000);
    await vi.advanceTimersByTimeAsync(15_000);
    upload.progress(100);
    await vi.advanceTimersByTimeAsync(15_000);
    upload.succeed();
    await pending;
    expect(upload.task.cancel).not.toHaveBeenCalled();
  });
});

describe("withDeadline", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("rejects when the promise stays pending", async () => {
    vi.useFakeTimers();
    const pending = withDeadline(new Promise(() => {}), 5_000, "timed out");
    const assertion = expect(pending).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(5_000);
    await assertion;
  });
});

describe("uploadErrorMessage", () => {
  it("explains a rules denial, a stall, and an unknown failure", () => {
    expect(uploadErrorMessage(Object.assign(new Error("nope"), { code: "storage/unauthorized" }))).toMatch(
      /permission/,
    );
    expect(uploadErrorMessage(Object.assign(new Error("slow"), { code: "storage/canceled" }))).toMatch(
      /took too long/,
    );
    expect(uploadErrorMessage(new Error("boom"))).toBe("Failed to upload file. Please try again.");
  });
});
