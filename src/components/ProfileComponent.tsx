"use client";

import useProfileStore from "@/zustand/useProfileStore";
import { useCallback, useEffect, useState } from "react";
import { isIOSReactNativeWebView } from "@/lib/utils/platform"; // Import the platform detection
import { usePaymentsStore } from "@/zustand/usePaymentsStore";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useAuthStore } from "@/zustand/useAuthStore";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfileComponent() {
  const profile = useProfileStore((state) => state.profile);
  const router = useRouter();
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const [fireworksApiKey, setFireworksApiKey] = useState(
    profile.fireworks_api_key
  );
  const [openaiApiKey, setOpenaiApiKey] = useState(profile.openai_api_key);
  const [useCredits, setUseCredits] = useState(profile.useCredits);
  const [showCreditsSection, setShowCreditsSection] = useState(true); // State to control visibility
  const addCredits = useProfileStore((state) => state.addCredits);
  const addPayment = usePaymentsStore((state) => state.addPayment);
  const deleteAccount = useProfileStore((state) => state.deleteAccount);
  const clearAuthDetails = useAuthStore((s) => s.clearAuthDetails);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const handleMessageFromRN = async (event: MessageEvent) => {
      // Process the message sent from React Native
      const message = event.data;
      if (message?.type === "IAP_SUCCESS") {
        await addPayment({
          id: message.message,
          amount: message.amount,
          status: "succeeded",
          mode: "iap",
          platform: message.platform,
          productId: message.productId,
          currency: message.currency,
        });
        await addCredits(10000);
      }
    };

    // Listen for messages from the RN WebView
    window.addEventListener("message", handleMessageFromRN);

    return () => {
      window.removeEventListener("message", handleMessageFromRN);
    };
  }, [addCredits, addPayment]);

  useEffect(() => {
    setFireworksApiKey(profile.fireworks_api_key);
    setOpenaiApiKey(profile.openai_api_key);
  }, [profile.fireworks_api_key, profile.openai_api_key]);

  useEffect(() => {
    // Conditionally hide the credits purchase section if in a React Native WebView on iOS
    setShowCreditsSection(!isIOSReactNativeWebView());
  }, []);

  const handleApiKeyChange = async () => {
    if (
      fireworksApiKey !== profile.fireworks_api_key ||
      openaiApiKey !== profile.openai_api_key
    ) {
      try {
        await updateProfile({
          fireworks_api_key: fireworksApiKey,
          openai_api_key: openaiApiKey,
        });
        console.log("API keys updated successfully!");
      } catch (error) {
        console.error("Error updating API keys:", error);
      }
    }
  };

  const handleCreditsChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setUseCredits(e.target.value === "credits");
    await updateProfile({ useCredits: e.target.value == "credits" });
  };

  const handleBuyClick = useCallback(() => {
    if (showCreditsSection) {
      window.location.href = "/payment-attempt";
    } else {
      window.ReactNativeWebView?.postMessage("INIT_IAP");
    }
  }, [showCreditsSection]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const onDeleteConfirm = useCallback(async () => {
    setShowDeleteModal(false);
    try {
      await deleteAccount();
      await signOut(auth);
      clearAuthDetails();
      toast.success("Account deleted successfully.");
      router.replace("/");
    } catch (error) {
      console.error("Error on deletion of account:", error);
    }
  }, [deleteAccount, clearAuthDetails, router]);

  const areApiKeysAvailable = fireworksApiKey && openaiApiKey;

  return (
    <div className="flex flex-col gap-4 profile-component">
      {/* Conditionally render the credits purchase section */}
      <div className="flex flex-col sm:flex-row px-2 py-3 gap-3 border border-gray-500 rounded-md">
        <div className="flex gap-2 w-full items-center">
          <div className="flex-1 bg-secondary-90 px-2 py-1 rounded-full text-center profile-component-available-credits">
            Available Credits: {Math.round(profile.credits)}
          </div>
          <button
            className="btn btn-shiny btn-shiny-blue profile-component-buy-credits"
            onClick={handleBuyClick}
          >
            Buy 10,000 Credits
          </button>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {showCreditsSection
            ? "You can either buy credits or add your own API keys for Fireworks and OpenAI."
            : "You can buy credits"}
        </div>
      </div>

      {showCreditsSection && (
        <div className="flex flex-col px-5 py-3 gap-3 border border-gray-500 rounded-md profile-component-keys">
          <label htmlFor="fireworks-api-key" className="text-sm font-medium">
            Fireworks API Key:
          </label>
          <input
            type="text"
            id="fireworks-api-key"
            value={fireworksApiKey}
            onChange={(e) => setFireworksApiKey(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 h-10"
            placeholder="Enter your Fireworks API Key"
          />
          <label htmlFor="openai-api-key" className="text-sm font-medium">
            OpenAI API Key:
          </label>
          <input
            type="text"
            id="openai-api-key"
            value={openaiApiKey}
            onChange={(e) => setOpenaiApiKey(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 h-10"
            placeholder="Enter your OpenAI API Key"
          />
          <button
            onClick={handleApiKeyChange}
            disabled={
              fireworksApiKey === profile.fireworks_api_key &&
              openaiApiKey === profile.openai_api_key
            }
            className="bg-blue-500 text-white px-3 py-2 rounded-md hover:opacity-50 disabled:opacity-50"
          >
            Update API Keys
          </button>
        </div>
      )}

      <div className="flex flex-col px-5 py-3 gap-3 border border-gray-500 rounded-md profile-component-settings">
        <label htmlFor="setting-lable-key" className="text-sm font-medium">
          Settings:
        </label>
        <button
          className="btn btn-shiny btn-shiny-red"
          onClick={handleDeleteClick}
        >
          Delete Account
        </button>
      </div>

      <div className="flex items-center px-5 py-3 gap-3 border border-gray-500 rounded-md profile-component-use-keys-credits">
        <label htmlFor="toggle-use-credits" className="text-sm font-medium">
          Use:
        </label>
        <select
          id="toggle-use-credits"
          value={useCredits ? "credits" : "apikeys"}
          onChange={handleCreditsChange}
          className="border border-gray-300 rounded-md px-3 py-2 h-10"
          disabled={!areApiKeysAvailable}
        >
          <option value="credits">Credits</option>
          {areApiKeysAvailable && <option value="apikeys">API Keys</option>}
        </select>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onDeleteConfirm}
        title="Confirm Account Deletion"
        description="Are you sure you want to delete your account? This action cannot be undone and will result in the permanent loss of all your data."
        confirmText="DELETE ACCOUNT"
      />
    </div>
  );
}