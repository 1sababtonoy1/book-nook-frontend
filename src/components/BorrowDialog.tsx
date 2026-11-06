"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Book } from "@/components/BookDetailsCard";
import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/client-api";
import { cn } from "@/lib/utils";

const BORROW_DAYS = 7;

const fieldClass = "h-12 border border-[#3a423d] bg-[#1b2420] text-[#eeeae0]";
const triggerClass =
  "h-12 rounded-xl bg-[#9ed4a9] px-6 font-semibold text-[#143122] hover:bg-[#b3e3bd]";

export default function BorrowDialog({ book }: { book: Book }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const available = (Number(book.copies) || 0) > 0;

  if (!available) {
    return (
      <Button type="button" disabled className="h-12 rounded-xl px-6 font-semibold">
        Not available
      </Button>
    );
  }

  if (isPending) {
    return (
      <Button type="button" disabled className="h-12 rounded-xl px-6">
        Borrow this book
      </Button>
    );
  }

  // Logged-out visitors are sent to log in first.
  if (!user) {
    return (
      <Link href="/login" className={cn(buttonVariants(), triggerClass)}>
        Log in to borrow
      </Link>
    );
  }

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      // The server takes your name and email from your login token.
      const res = await authFetch("/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book._id }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Could not borrow the book.");

      toast.success(
        `"${book.title}" borrowed successfully. Enjoy reading for ${BORROW_DAYS} days!`
      );
      setOpen(false);
      router.push("/my-borrows");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants(), triggerClass)}>
        Borrow this book
      </DialogTrigger>

      <DialogContent className="border-[#303a34] bg-[#1b2420] text-[#eeeae0] sm:max-w-[28rem]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Borrow &quot;{book.title}&quot;
          </DialogTitle>
          <DialogDescription className="text-[#aaa99e]">
            You can keep this book for {BORROW_DAYS} days.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleConfirm} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="borrow-name">User Name</Label>
            <Input
              id="borrow-name"
              value={user.name}
              readOnly
              className={fieldClass}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="borrow-email">User Email</Label>
            <Input
              id="borrow-email"
              value={user.email}
              readOnly
              className={fieldClass}
            />
          </div>

          <div className="flex justify-end border-t border-[#303a34] pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#9ed4a9] font-medium text-[#101713] hover:bg-[#b3e3bd]"
            >
              {isSaving ? "Borrowing…" : "Confirm Borrow"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}