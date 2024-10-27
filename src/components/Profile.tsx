"use client";

import AuthDataDisplay from "./AuthDataDisplay";
import PaymentsPage from "./PaymentsPage";
import ProfileComponent from "./ProfileComponent";
import useProfileStore from "@/zustand/useProfileStore";
import Image from "next/image";
import CustomListbox from "@/components/ui/CustomListbox";
import { userInputs } from "@/constants/userInputs";
import { User2 } from "lucide-react";

export default function Profile() {
    const profile = useProfileStore((state) => state.profile);
    const updateProfile = useProfileStore((state) => state.updateProfile);
    const identityLevels = userInputs?.identity?.identityLevels?.[profile?.identity ?? "student"] ?? ["3rd grade"];

    if (!profile) {
        return "Loading...";
    }

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto gap-4">
            <div>
                <h1 className="text-xl font-bold text-left text-primary">Profile</h1>
                <hr className="border border-primary" />
            </div>

            <div className="flex flex-col gap-y-2">
                <div className="flex flex-row items-center gap-x-4">
                    <p className="font-medium text-primary">Profile Image: </p>
                    {profile.photoUrl ?
                        <Image src={profile.photoUrl} alt="Profile Image" className="rounded-full" width={40} height={40} />
                        :
                        <div className="h-9 aspect-square">
                            <User2 size={25} className="h-full w-full object-cover text-secondary" />
                        </div>
                    }
                </div>
                <div className="flex flex-row gap-x-2">
                    <p className="font-medium text-primary">Display Name: </p> <p>{profile.displayName}</p>
                </div>
                <div className="flex flex-row gap-x-2">
                    <p className="font-medium text-primary">Email: </p> <p>{profile.contactEmail}</p>
                </div>
                <AuthDataDisplay />
            </div>
            {/* Identity Settings */}
            <div>
                <div>
                    <h2 className="text-primary text-left font-medium text-lg">Identity</h2>
                    <hr className="border-0.5 border-accent mb-2" />
                </div>
                <div className="flex flex-wrap items-center justify-center">
                    <span className="mr-2">I am a</span>
                    <div className="flex flex-row gap-x-2">
                        {/* Identity Level */}
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
                            placeholder="3rd grade"
                        />
                        {/* Identity Selection */}
                        <CustomListbox
                            value={profile?.identity ?? "student"} // Default to "student"
                            options={userInputs?.identity?.options?.map((identity) => ({
                                label: identity,
                                value: identity,
                            })) ?? []} // Fallback to an empty array
                            onChange={(value) => {
                                if (profile?.identity !== value) {
                                    // Update identity and reset identityLevel to the first in the new array
                                    const newIdentityLevels = userInputs?.identity?.identityLevels?.[value] ?? ["3rd grade"];
                                    updateProfile({ identity: value, identityLevel: newIdentityLevels[0] });
                                }
                            }}
                            buttonClassName="w-fit"
                            placeholder="student"
                        />
                    </div>
                    <span className="w-fit ml-0.5">.</span>
                </div>
            </div>

            <ProfileComponent />
            <PaymentsPage />
        </div>
    );
}
