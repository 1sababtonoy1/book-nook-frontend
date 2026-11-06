"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/client-api";

type Borrow = {
  _id: string;
  bookId: string;
  title: string;
  author?: string;
  imageUrl?: string;
  borrowDate: string;
  returnDate: string;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function Thumb({ borrow }: { borrow: Borrow }) {
  const [failed, setFailed] = useState(false);

  if (!borrow.imageUrl || failed) {
    return (
      <div className="grid h-24 w-[72px] place-items-center rounded-md bg-[#1f2b25] text-[#8fc99c]">
        <BookOpen className="size-6" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={borrow.imageUrl}
      alt={`Cover for ${borrow.title}`}
      onError={() => setFailed(true)}
      className="h-24 w-[72px] rounded-md object-cover"
    />
  );
}

export default function MyBorrowsTable() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    let cancelled = false;

    async function load() {
      try {
        const res = await authFetch("/my-borrows", { cache: "no-store" });
        if (!res.ok) throw new Error("Could not load your borrowed books.");

        const data = await res.json();
        if (!cancelled) setBorrows(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          toast.error(
            err instanceof Error ? err.message : "Something went wrong.",
            { id: "borrows-load-error" }
          );
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

  const handleReturn = async (borrow: Borrow) => {
    setReturningId(borrow._id);

    try {
      const res = await authFetch(`/borrow/${borrow._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not return the book.");

      setBorrows((current) => current.filter((b) => b._id !== borrow._id));
      toast.success(`"${borrow.title}" returned successfully. Thank you!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setReturningId(null);
    }
  };

  if (isPending) {
    return <p className="py-16 text-center text-[#aaa99e]">Loading…</p>;
  }

  if (!email) {
    return (
      <div className="rounded-2xl border border-[#303a34] bg-[#121a16] px-6 py-16 text-center">
        <p className="text-lg text-[#aaa99e]">
          Please log in to see the books you borrowed.
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
    return <p className="py-16 text-center text-[#aaa99e]">Loading your borrows…</p>;
  }

  return (
    <>
      {borrows.length === 0 ? (
        <div className="rounded-2xl border border-[#303a34] bg-[#121a16] px-6 py-16 text-center">
          <p className="text-lg text-[#aaa99e]">You haven’t borrowed any books yet.</p>
          <Link
            href="/books"
            className="mt-4 inline-block font-semibold text-[#8fc99c] hover:underline"
          >
            Browse books
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#303a34] bg-[#121a16]">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-[#303a34] text-sm font-medium">
                <th className="px-5 py-4">Image</th>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Borrow Date</th>
                <th className="px-5 py-4">Return Date</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {borrows.map((borrow) => (
                <tr
                  key={borrow._id}
                  className="border-b border-[#303a34] last:border-b-0"
                >
                  <td className="px-5 py-4">
                    <Thumb borrow={borrow} />
                  </td>
                  <td className="px-5 py-4 font-medium">
                    <Link
                      href={`/books/${borrow.bookId}`}
                      className="hover:text-[#8fc99c]"
                    >
                      {borrow.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4">{formatDate(borrow.borrowDate)}</td>
                  <td className="px-5 py-4">{formatDate(borrow.returnDate)}</td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={returningId === borrow._id}
                      onClick={() => handleReturn(borrow)}
                      className="border-[#3a423d] bg-transparent text-[#eeeae0] hover:bg-[#18211c]"
                    >
                      {returningId === borrow._id ? "Returning…" : "Return Book"}
                    </Button>
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