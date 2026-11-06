"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Logged-out visitors can't see a profile, so send them to login.
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login");
    }
  }, [isPending, user, router]);

  if (isPending || !user) {
    return (
      <main className="flex min-h-[60vh] items-start justify-center bg-[#101612] px-6 py-12">
        <div className="h-[230px] w-full max-w-[380px] animate-pulse rounded-2xl border border-[#2c352f] bg-[#1a211d]" />
      </main>
    );
  }

  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="flex min-h-[60vh] items-start justify-center bg-[#101612] px-6 py-12">
      <div className="flex w-full max-w-[380px] flex-col items-center rounded-2xl border border-[#2c352f] bg-[#1a211d] px-8 py-6 text-center">
        {/* Photo */}
        <Avatar className="size-[84px] ring-4 ring-[#2f4a39]">
          <AvatarImage
            src={user.image ?? undefined}
            alt={user.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-[#9ac8a0] text-3xl font-semibold text-[#101713]">
            {initial}
          </AvatarFallback>
        </Avatar>

        {/* Name */}
        <h1 className="mt-5 font-serif text-3xl font-bold leading-tight text-[#f1ece0]">
          {user.name}
        </h1>

        {/* Email */}
        <p className="mt-1 break-all text-base text-[#b4bcb6]">{user.email}</p>

        {/* Member since */}
        {memberSince && (
          <p className="mt-4 text-sm text-[#9aa39c]">
            Member since {memberSince}
          </p>
        )}
      </div>
    </main>
  );
};

export default ProfilePage;