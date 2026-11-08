import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { API, getServerToken } from "@/lib/server-api";

//Got help from AI to use the below line
export const dynamic = "force-dynamic";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  copies: number;
  imageUrl: string;
  description?: string;
};

async function getBooks(): Promise<Book[]> {
  // Called outside the try/catch so Next.js can handle its own signals.
  const token = await getServerToken();

  try {
    const response = await fetch(`${API}/books`, {
      cache: "no-store",
      headers: token ? { authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw new Error(`Could not load books (${response.status})`);
    }

    const data: unknown = await response.json();


    if (Array.isArray(data)) {
      return data as Book[];
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "books" in data &&
      Array.isArray(data.books)
    ) {
      return data.books as Book[];
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return [];
  }
}

export default async function AllBooksPage() {
  const books = await getBooks();

  return (
    <main className="min-h-screen bg-[#0d1712] px-6 py-12 text-[#edf1eb] sm:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#d8845b]">
            The Community Shelf
          </p>

          <h1 className="font-serif text-5xl font-bold tracking-tight sm:text-6xl">
            All books
          </h1>

          <p className="mt-4 text-lg text-[#aab7ae]">
            Browse books shared by readers in your neighborhood.
          </p>
        </header>

        {books.length === 0 ? (
          <section className="rounded-2xl border border-[#31443a] bg-[#17251e] px-6 py-16 text-center">
            <BookOpen className="mx-auto size-10 text-[#91c99d]" />

            <h2 className="mt-4 text-2xl font-semibold">
              No books to show yet
            </h2>

            <p className="mt-2 text-[#aab7ae]">
              Books will appear here once they’ve been added to the library.
            </p>
          </section>
        ) : (
          <section
            aria-label="All books"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {books.map((book) => (
              <article
                key={book._id}
                className="overflow-hidden rounded-[24px] border border-[#31443a] bg-[#192821]"
              >
                <div className="relative aspect-[4/3] bg-[#24342b]">
                  {book.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={book.imageUrl}
                      alt={`Cover for ${book.title}`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#91c99d]">
                      <BookOpen className="size-14" />
                    </div>
                  )}

                  <span className="absolute left-5 top-5 rounded-full bg-[#faf8f2] px-4 py-2 text-sm font-semibold text-[#315642]">
                    {book.category}
                  </span>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold">{book.title}</h2>

                  <p className="mt-2 text-lg text-[#aab7ae]">{book.author}</p>

                  {book.description && (
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#c2cbc4]">
                      {book.description}
                    </p>
                  )}

                  <div className="my-5 border-t border-[#34463c]" />

                  <p className="text-sm text-[#aab7ae]">
                    {book.copies} {book.copies === 1 ? "copy" : "copies"}{" "}
                    available
                  </p>

                  <Link
                    href={`/books/${book._id}`}
                    className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[#294637] font-semibold text-[#a9d9b2] transition-colors hover:bg-[#345642]"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#48604f] px-6 text-sm font-medium text-[#edf1eb] transition-colors hover:bg-[#192821]"
          >
            <ArrowLeft className="mr-2 size-4" />
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}