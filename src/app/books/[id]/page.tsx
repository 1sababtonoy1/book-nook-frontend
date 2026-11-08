import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import BookDetailsCard, { type Book } from "@/components/BookDetailsCard";
import { API, getServerToken } from "@/lib/server-api";

export const dynamic = "force-dynamic";

async function getBook(
  id: string,
  token: string,
): Promise<{ book: Book | null; unauthorized: boolean }> {
  try {
    const response = await fetch(`${API}/books/${id}`, {
      cache: "no-store",
      headers: { authorization: `Bearer ${token}` },
    });

    if (response.status === 401) return { book: null, unauthorized: true };
    if (!response.ok) return { book: null, unauthorized: false };

    const data = await response.json();


    const book = data?.book ?? data;

    return {
      book: book && book._id ? (book as Book) : null,
      unauthorized: false,
    };
  } catch (error) {
    console.error("Failed to fetch book:", error);
    return { book: null, unauthorized: false };
  }
}

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const token = await getServerToken();
  if (!token) redirect("/login");

  const { book, unauthorized } = await getBook(id, token);

  if (unauthorized) redirect("/login");
  if (!book) notFound();

  return (
    <main className="min-h-screen bg-[#0d1712] px-6 py-12 text-[#edf1eb] sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/books"
          className="mb-8 inline-flex items-center text-sm font-medium text-[#9fb0a5] transition-colors hover:text-[#edf1eb] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a9d9b2]"
        >
          <ArrowLeft className="mr-2 size-4" />
          All books
        </Link>

        <BookDetailsCard book={book} />
      </div>
    </main>
  );
}