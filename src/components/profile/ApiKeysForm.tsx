"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import useProfileStore from "@/zustand/useProfileStore";
import SecretInput from "./SecretInput";

export default function ApiKeysForm() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const [fireworksApiKey, setFireworksApiKey] = useState(profile.fireworks_api_key);
  const [openaiApiKey, setOpenaiApiKey] = useState(profile.openai_api_key);
  const [saving, setSaving] = useState(false);

  // Re-sync the inputs when the stored keys change elsewhere (adjusting state during render).
  const [prevStoreKeys, setPrevStoreKeys] = useState({
    fireworks: profile.fireworks_api_key,
    openai: profile.openai_api_key,
  });
  if (
    profile.fireworks_api_key !== prevStoreKeys.fireworks ||
    profile.openai_api_key !== prevStoreKeys.openai
  ) {
    setPrevStoreKeys({ fireworks: profile.fireworks_api_key, openai: profile.openai_api_key });
    setFireworksApiKey(profile.fireworks_api_key);
    setOpenaiApiKey(profile.openai_api_key);
  }

  const dirty =
    fireworksApiKey !== profile.fireworks_api_key || openaiApiKey !== profile.openai_api_key;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirty) return;
    setSaving(true);
    try {
      await updateProfile({ fireworks_api_key: fireworksApiKey, openai_api_key: openaiApiKey });
    } catch (error) {
      console.error("Error updating API keys:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <SecretInput
        id="openai-api-key"
        label="OpenAI API key"
        value={openaiApiKey}
        onChange={setOpenaiApiKey}
        placeholder="sk-…"
      />
      <SecretInput
        id="fireworks-api-key"
        label="Fireworks API key"
        value={fireworksApiKey}
        onChange={setFireworksApiKey}
        placeholder="fw_…"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Saved to your profile and used when API-key mode is on.
        </p>
        <Button type="submit" variant="secondary" size="sm" disabled={!dirty} loading={saving}>
          Save keys
        </Button>
      </div>
    </form>
  );
}
