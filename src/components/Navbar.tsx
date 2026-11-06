"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, LogOut, User } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

// Visible to everyone.
const publicLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
];

// Visible only when logged in.
const memberLinks = [
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // While the session is loading, only the public links show,
  // so logged-out visitors never see member links flash on screen.
  const links = user ? [...publicLinks, ...memberLinks] : publicLinks;

  const initial = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="border-b border-white/10 bg-[#0f1713] text-[#e9efe9]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-12">
        {/* Logo + links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-[#9dc9a3] text-[#0f1713]">
              <BookOpen className="size-5" />
            </span>
            <span className="font-serif text-[28px] font-semibold tracking-tight text-[#f3f6f3]">
              BookNook
            </span>
          </Link>

          <nav className="hidden items-center gap-7 sm:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-[15px] font-medium transition-colors hover:text-[#9dc9a3]",
                  pathname === l.href ? "text-[#9dc9a3]" : "text-[#e9efe9]/65"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Auth area */}
        <div className="flex h-10 items-center gap-2">
          {isPending ? (
            // Placeholder while the session loads, so the buttons don't flash.
            <div className="size-10 animate-pulse rounded-full bg-white/10" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Open user menu"
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#9dc9a3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1713]"
              >
                <Avatar className="size-10 ring-2 ring-white/10">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback className="bg-[#9dc9a3] font-semibold text-[#0f1713]">
                    {initial}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="size-4" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="size-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-10 border-white/20 bg-transparent px-4 text-[15px] font-medium text-[#e9efe9] hover:bg-white/10 hover:text-white"
                )}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants(),
                  "h-10 bg-[#9dc9a3] px-4 text-[15px] font-medium text-[#0f1713] hover:bg-[#b2d8b7]"
                )}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}