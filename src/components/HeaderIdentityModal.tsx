"use client";

import { XIcon } from "lucide-react";
import { RefObject } from "react";
import CustomListbox from "@/components/ui/CustomListbox";
import useProfileStore from "@/zustand/useProfileStore";
import { userInputs } from "@/lib/constants/userInputs";
import { useAuthStore } from "@/zustand/useAuthStore";

type Props = {
  identityModalOpen: boolean;
  modalClosing: boolean;
  closeModal: () => void;
  modalRef: RefObject<HTMLDivElement | null>;
};

export default function HeaderIdentityModal({
  identityModalOpen,
  modalClosing,
  closeModal,
  modalRef,
}: Props) {
  const uid = useAuthStore((s) => s.uid);
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const identityLevels = profile?.identity
    ? userInputs.identity.identityLevels[profile.identity]
    : userInputs.identity.identityLevels["student"];

  if (!uid || !identityModalOpen) return null;

  return (

        <>
          <div ref={modalRef} className={`bg-black/30 absolute inset-0 w-full h-full z-0 ${identityModalOpen ? 'overlay-open' : 'overlay-closed'}`} aria-hidden="true" />
          <div className={`fixed w-96 bg-secondary p-4 rounded-lg flex flex-col place-self-center top-1/3 z-10 transition-all ${identityModalOpen ? 'animate-enter' : modalClosing ? 'animate-exit' : 'hidden'}`}>
            <div className="flex justify-end">
              <button type="button" aria-label="Close dialog" className="bg-transparent border-0 p-0" onClick={closeModal}><XIcon size={24} className="text-primary-10" /></button>
            </div>
            <div className="flex flex-col gap-y-4">
              <div>
                <h2 className="text-primary-20 text-left font-medium text-lg">Select your user type and level of experience.</h2>
                <p className="text-primary-20 text-left text-sm">This information helps us tailor your experience on Grade.me.</p>
                <hr />
              </div>
              <div className="flex flex-wrap items-baseline justify-center">
                <span className="mr-2">I am a</span>
                <div className="flex flex-row gap-x-2">
                  <CustomListbox
                    value={profile?.identityLevel ?? identityLevels[0]}
                    options={
                      identityLevels.map((level) => ({
                        label: level,
                        value: level,
                      }))
                    }
                    onChange={(value) => {
                      if (profile?.identityLevel !== value) {
                        updateProfile({ identityLevel: value });
                      }
                    }}
                    buttonClassName="w-fit"
                    placeholder="Select Level"
                  />
                  <CustomListbox
                    value={profile?.identity ?? "student"}
                    options={userInputs?.identity?.options?.map((identity) => ({
                      label: identity,
                      value: identity,
                    })) ?? []}
                    onChange={(value) => {
                      if (profile?.identity !== value) {
                        const newIdentityLevels = userInputs?.identity?.identityLevels?.[value] ?? ["3rd grade"];
                        updateProfile({ identity: value, identityLevel: newIdentityLevels[0] });
                      }
                    }}
                    buttonClassName="w-fit"
                    placeholder="Select User Type"
                  />
                </div>
                <span className="w-fit ml-0.5">.</span>
              </div>
              <button type="button" onClick={closeModal} className="flex place-self-end btn btn-shiny btn-shiny-green">Finish</button>
            </div>
          </div>
        </>
  );
}
