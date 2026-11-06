import { BookOpen } from "lucide-react";

import BorrowDialog from "@/components/BorrowDialog";

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  copies: number | string;
  imageUrl?: string;
  description?: string;
  userName?: string;
  userEmail?: string;
};

// A MongoDB ObjectId starts with a creation timestamp, so we can show
// "Added on ..." without needing a separate date field.
function addedOn(id: string) {
  const seconds = parseInt(id.slice(0, 8), 16);
  if (Number.isNaN(seconds)) return null;

  return new Date(seconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BookDetailsCard({ book }: { book: Book }) {
  const copies = Number(book.copies) || 0;
  const available = copies > 0;
  const added = addedOn(book._id);

  return (
    <article className="rounded-[32px] border border-[#2b3d33] bg-[#14221b] p-6 sm:p-10 lg:p-12">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        {/* Cover */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#1d2d24]">
          {book.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.imageUrl}
              alt={`Cover for ${book.title}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#91c99d]">
              <BookOpen className="size-16" />
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#25382d] px-4 py-2 text-sm font-semibold text-[#a9d9b2]">
              {book.category}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl">
            {book.title}
          </h1>

          <p className="mt-4 text-lg text-[#9fb0a5]">by {book.author}</p>

          <p className="mt-6 max-w-xl text-base leading-8 text-[#c2cbc4]">
            {book.description || "The owner hasn’t added a description yet."}
          </p>

          {(book.userName || added) && (
            <p className="mt-6 text-sm text-[#9fb0a5]">
              {book.userName && (
                <>
                  Shared by{" "}
                  <span className="font-semibold text-[#edf1eb]">
                    {book.userName}
                  </span>
                </>
              )}
              {book.userName && added && " · "}
              {added && <>Added {added}</>}
            </p>
          )}

          <div className="mt-8 border-t border-[#2b3d33] pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium uppercase tracking-[0.12em] text-[#9fb0a5]">
                Availability
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  available
                    ? "bg-[#25382d] text-[#a9d9b2]"
                    : "bg-[#3a2a26] text-[#e8a08c]"
                }`}
              >
                {available
                  ? `${copies} ${copies === 1 ? "copy" : "copies"} available`
                  : "No copies available"}
              </span>

              <BorrowDialog book={book} />
            </div>

            {!available && (
              <p className="mt-4 text-sm text-[#9fb0a5]">
                Check back soon. A copy may be returned.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}