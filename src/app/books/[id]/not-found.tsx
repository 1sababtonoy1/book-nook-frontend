import Link from "next/link";
import { BookX } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BookNotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#0d1712] px-6 py-12">
      <div className="flex w-full max-w-[480px] flex-col items-center rounded-2xl border border-[#2c352f] bg-[#1a211d] p-8 text-center sm:p-12">
        <span className="grid size-16 place-items-center rounded-full bg-[#9ac8a0]/15 text-[#9ac8a0]">
          <BookX className="size-8" />
        </span>

        <p className="mt-6 text-sm font-medium uppercase tracking-[0.3em] text-[#9ac8a0]">
          Error 404
        </p>

        <h1 className="mt-3 font-serif text-4xl font-bold text-[#f1ece0]">
          Book not found
        </h1>

        <p className="mt-4 text-base text-[#9aa39c]">
          This book may have been removed, or the link is wrong.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/books"
            className={cn(
              buttonVariants(),
              "h-11 bg-[#9ac8a0] px-5 font-medium text-[#101713] hover:bg-[#abd6b0]"
            )}
          >
            Browse Books
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 border-[#3a423d] bg-transparent px-5 font-medium text-[#eeeae0] hover:bg-[#222925] hover:text-[#eeeae0]"
            )}
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}