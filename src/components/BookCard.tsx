"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import type { Book } from "@/components/BookDetailsCard";
import { cn } from "@/lib/utils";

export default function BookCard({ book }: { book: Book }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = book.imageUrl && !imageFailed;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#303a34] bg-[#121a16] transition-colors hover:border-[#4a5a50]">
      <div className="relative aspect-[3/4] w-full bg-[#1f2b25]">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.imageUrl}
            alt={`Cover for ${book.title}`}
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#8fc99c]">
            <BookOpen className="size-12" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5">
        <span className="w-fit rounded-full bg-[#202b25] px-3 py-1 text-sm text-[#eeeae0]">
          {book.category}
        </span>

        <h3 className="mt-4 line-clamp-1 font-serif text-xl font-bold text-[#f1ece0]">
          {book.title}
        </h3>
        <p className="mt-2 line-clamp-1 text-[#aaa99e]">by {book.author}</p>

        <Link
          href={`/books/${book._id}`}
          className={cn(
            buttonVariants(),
            "mt-5 h-11 w-full rounded-lg bg-[#9ac8a0] font-medium text-[#101713] hover:bg-[#abd6b0]",
          )}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}