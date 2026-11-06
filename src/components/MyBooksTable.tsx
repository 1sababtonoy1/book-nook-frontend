"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import AddBookDialog from "@/components/AddBookDialogue";
import EditBooksDialog from "@/components/EditBooksDialog";
import type { Book } from "@/components/BookDetailsCard";
import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/client-api";

function BookThumb({ book }: { book: Book }) {
  const [failed, setFailed] = useState(false);

  if (!book.imageUrl || failed) {
    return (
      <div className="grid size-14 shrink-0 place-items-center rounded-lg bg-[#1f2b25] text-[#8fc99c]">
        <BookOpen className="size-6" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={book.imageUrl}
      alt={`Cover for ${book.title}`}
      onError={() => setFailed(true)}
      className="size-14 shrink-0 rounded-lg object-cover"
    />
  );
}

export default function MyBooksTable() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    let cancelled = false;

    async function load() {
      try {
        const res = await authFetch("/my-books", { cache: "no-store" });
        if (!res.ok) throw new Error("Could not load your books.");

        const data = await res.json();
        const list: Book[] = Array.isArray(data) ? data : (data?.books ?? []);
        if (!cancelled) setBooks(list);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [email]);

  const handleDelete = async (book: Book) => {
    if (!window.confirm(`Delete "${book.title}"? This can't be undone.`)) return;

    setDeletingId(book._id);
    setError("");

    try {
      const res = await authFetch(`/books/${book._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete the book.");
      setBooks((current) => current.filter((b) => b._id !== book._id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = (updated: Book) => {
    setBooks((current) =>
      current.map((b) => (b._id === updated._id ? updated : b)),
    );
  };

  const handleAdded = (book: Book) => {
    setBooks((current) => [book, ...current]);
  };

  if (isPending) {
    return <p className="py-16 text-center text-[#aaa99e]">Loading…</p>;
  }

  if (!email) {
    return (
      <div className="rounded-2xl border border-[#303a34] bg-[#121a16] px-6 py-16 text-center">
        <p className="text-lg text-[#aaa99e]">
          Please log in to see the books you added.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block font-semibold text-[#8fc99c] hover:underline"
        >
          Go to login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <p className="py-16 text-center text-[#aaa99e]">Loading your books…</p>;
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-[#aaa99e]">
          {books.length} {books.length === 1 ? "book" : "books"} shared
        </p>
        <AddBookDialog onAdded={handleAdded} />
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm text-[#f08a8a]">
          {error}
        </p>
      )}

      {books.length === 0 ? (
        <div className="rounded-2xl border border-[#303a34] bg-[#121a16] px-6 py-16 text-center">
          <p className="mb-5 text-lg text-[#aaa99e]">
            You haven’t added any books yet.
          </p>
          <div className="flex justify-center">
            <AddBookDialog onAdded={handleAdded} />
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#303a34] bg-[#121a16]">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-[#303a34] text-sm font-medium">
                <th className="px-5 py-4">Book</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Copies</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book) => (
                <tr
                  key={book._id}
                  className="border-b border-[#303a34] last:border-b-0"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <BookThumb book={book} />
                      <div>
                        <p className="font-semibold">{book.title}</p>
                        <p className="text-[#aaa99e]">{book.author}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#202b25] px-3 py-1 text-sm">
                      {book.category}
                    </span>
                  </td>

                  <td className="px-5 py-4">{book.copies}</td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <EditBooksDialog book={book} onSaved={handleSaved} />
                      <Button
                        type="button"
                        disabled={deletingId === book._id}
                        onClick={() => handleDelete(book)}
                        className="bg-[#4a2527] text-[#f08a8a] hover:bg-[#5a2c2e]"
                      >
                        {deletingId === book._id ? "Deleting…" : "Delete"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}