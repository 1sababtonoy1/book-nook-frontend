"use client";

import Link from "next/link";

import AddBookDialog from "@/components/AddBookDialogue";
import { authClient } from "@/lib/auth-client";

export default function AddBookPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  return (
    <main className="min-h-screen bg-[#0d1511] px-6 py-12 text-[#eeeae0]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 border-b border-[#303a34] bg-[#18241e] px-6 py-12 text-center sm:py-16">
          <h1 className="font-serif text-5xl font-bold sm:text-7xl">
            Add a Book
          </h1>
          <p className="mt-5 text-lg text-[#aaa99e] sm:text-2xl">
            Put a book from your shelf into the library.
          </p>
        </header>

        <section className="rounded-2xl border border-[#303a34] bg-[#111a15] px-6 py-16 text-center sm:px-10">
          {isPending ? (
            <p className="text-[#aaa99e]">Loading…</p>
          ) : user ? (
            <>
              <p className="mb-6 text-lg text-[#aaa99e]">
                Ready to share a book? Fill in the details and it will appear
                in the library right away.
              </p>
              <div className="flex justify-center">
                <AddBookDialog />
              </div>
              <Link
                href="/my-books"
                className="mt-6 inline-block text-sm font-semibold text-[#8fc99c] hover:underline"
              >
                View my books
              </Link>
            </>
          ) : (
            <>
              <p className="text-lg text-[#aaa99e]">
                Please log in to add a book.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-block font-semibold text-[#8fc99c] hover:underline"
              >
                Go to login
              </Link>
            </>
          )}
        </section>
      </div>
    </main>
  );
}