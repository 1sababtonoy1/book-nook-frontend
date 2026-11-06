import Link from "next/link";
import { connection } from "next/server";

import BookCard from "@/components/BookCard";
import type { Book } from "@/components/BookDetailsCard";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const LIMIT = 10; // two rows of five on large screens

async function getLatestBooks(): Promise<{ books: Book[]; failed: boolean }> {
  // Outside the try/catch on purpose, so Next.js can handle its own signals.
  await connection();

  try {
    const res = await fetch(`${API}/books?limit=${LIMIT}`, {
      cache: "no-store",
    });
    if (!res.ok) return { books: [], failed: true };

    const data = await res.json();
    const list: Book[] = Array.isArray(data) ? data : (data?.books ?? []);

    // A MongoDB ObjectId begins with a timestamp, so newer books have a larger _id.
    const latest = [...list]
      .sort((a, b) => b._id.localeCompare(a._id))
      .slice(0, LIMIT);

    return { books: latest, failed: false };
  } catch (error) {
    console.error("Failed to load new arrivals:", error);
    return { books: [], failed: true };
  }
}

export default async function NewArrivals() {
  const { books, failed } = await getLatestBooks();

  return (
    <section className="bg-[#0f1713] px-6 py-16 text-[#eeeae0] sm:py-20 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-bold text-[#f1ece0] sm:text-5xl">
            New Arrivals
          </h2>
          <p className="mt-4 text-lg text-[#aaa99e] sm:text-xl">
            The latest books added by our readers.
          </p>
        </div>

        {books.length > 0 ? (
          <>
            <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/books"
                className="font-semibold text-[#8fc99c] hover:underline"
              >
                View all books →
              </Link>
            </div>
          </>
        ) : (
          <div className="mt-12 rounded-2xl border border-[#303a34] bg-[#121a16] px-6 py-16 text-center">
            <p className="text-lg text-[#aaa99e]">
              {failed
                ? "We couldn’t load the latest books right now."
                : "No books have been added yet."}
            </p>
            {!failed && (
              <Link
                href="/add-book"
                className="mt-4 inline-block font-semibold text-[#8fc99c] hover:underline"
              >
                Add the first book
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}