import { useAuthStore } from "@/zustand/useAuthStore";

export default function AuthDataDisplay() {
    const uid = useAuthStore((s) => s.uid);
    const authEmail = useAuthStore((s) => s.authEmail);

    return (
        <div className="flex flex-col space-y-2 rounded-md">
            <div className="flex flex-row items-center space-x-1">
                <div className="text-primary-10 font-medium">Login email:</div>
                <div className="px-3 py-1 items-center text-black bg-secondary-90 rounded-md">
                    {authEmail}
                </div>
            </div>
            <div className="flex flex-row items-center space-x-1">
                <div className="text-primary-10 font-medium">User ID:</div>
                <div className="px-3 py-1 items-center text-black bg-secondary-90 rounded-md">
                    {uid}
                </div>
            </div>
        </div>
    );
}
