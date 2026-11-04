export async function publishSession(idToken: string): Promise<void> {
  const response = await fetch("/api/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token: idToken }),
  });
  if (!response.ok) throw new Error("Session cookie was not accepted.");
}

export function clearSessionCookie(): void {
  void fetch("/api/session", { method: "DELETE" }).catch((error: unknown) => {
    console.error("Failed to clear the session cookie:", error);
  });
}
