import { describe, expect, it } from "vitest";
import { isOwnUploadUrl } from "./uploadUrl";

const BUCKET = "grademe-test.appspot.com";
const url = (path: string, bucket = BUCKET, host = "firebasestorage.googleapis.com") =>
  `https://${host}/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media&token=abc`;

describe("isOwnUploadUrl", () => {
  it("accepts the caller's own upload in the configured bucket", () => {
    expect(isOwnUploadUrl(url("uploads/alice/essay.pdf"), "alice", BUCKET)).toBe(true);
  });

  it.each([
    ["another user's file", url("uploads/bob/essay.pdf")],
    ["a prefix-sharing uid", url("uploads/alice2/essay.pdf")],
    ["path traversal", url("uploads/alice/../bob/essay.pdf")],
    ["outside uploads/", url("users/alice/profile.json")],
    ["another bucket", url("uploads/alice/essay.pdf", "evil.appspot.com")],
    ["another host", url("uploads/alice/essay.pdf", BUCKET, "evil.example.com")],
    ["plain http", url("uploads/alice/essay.pdf").replace("https:", "http:")],
    ["an explicit port", url("uploads/alice/essay.pdf").replace(".com/", ".com:8443/")],
    ["cloud metadata", "https://169.254.169.254/computeMetadata/v1/"],
    ["localhost", "https://localhost/v0/b/x/o/y"],
    ["garbage", "not a url"],
  ])("rejects %s", (_label, candidate) => {
    expect(isOwnUploadUrl(candidate, "alice", BUCKET)).toBe(false);
  });

  it("rejects when uid or bucket is missing", () => {
    expect(isOwnUploadUrl(url("uploads/alice/essay.pdf"), "", BUCKET)).toBe(false);
    expect(isOwnUploadUrl(url("uploads/alice/essay.pdf"), "alice", undefined)).toBe(false);
  });
});
