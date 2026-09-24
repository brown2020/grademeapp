"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  CircleUser,
  Coins,
  FileText,
  LifeBuoy,
  LogOut,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useProfileStore from "@/zustand/useProfileStore";
import { useAuthStore } from "@/zustand/useAuthStore";
import { signOutUser } from "@/lib/auth/signOut";

export function Avatar({
  src,
  name,
  className = "size-8",
}: {
  src?: string;
  name?: string;
  className?: string;
}) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={64}
        height={64}
        className={`${className} rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      className={`${className} flex items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground`}
      aria-hidden
    >
      {initial}
    </span>
  );
}

export function UserMenu() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const authEmail = useAuthStore((s) => s.authEmail);
  const authDisplayName = useAuthStore((s) => s.authDisplayName);
  const name = profile.displayName || authDisplayName || authEmail;

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Couldn't sign out. Please try again.");
    } finally {
      router.push("/");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-muted"
        aria-label="Account menu"
      >
        <Avatar src={profile.photoUrl} name={name} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel>
          <div className="truncate font-medium">{name}</div>
          {authEmail && authEmail !== name && (
            <div className="truncate text-xs font-normal text-muted-foreground">
              {authEmail}
            </div>
          )}
        </DropdownMenuLabel>
        {profile.useCredits && (
          <div className="mx-2 mb-1 flex items-center justify-between rounded-md bg-muted px-2 py-1.5 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Coins className="size-3.5" /> Credits
            </span>
            <span className="font-semibold tabular-nums">
              {Math.round(profile.credits ?? 0).toLocaleString()}
            </span>
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push("/profile")}>
          <CircleUser /> Profile & billing
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => router.push("/support")}>
          <LifeBuoy /> Support
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => router.push("/terms")}>
          <FileText /> Terms
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => router.push("/privacy")}>
          <Shield /> Privacy
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
