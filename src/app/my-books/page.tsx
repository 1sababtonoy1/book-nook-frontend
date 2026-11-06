"use client"
import MyBooksTable from "@/components/MyBooksTable";

export default function MyBooksPage() {
  return (
    <main className="min-h-screen bg-[#0f1713] text-[#eeeae0]">
      <header className="border-b border-[#2a342e] bg-[#1b2520] px-6 py-16 text-center sm:py-20">
        <h1 className="font-serif text-5xl font-bold sm:text-6xl">My Books</h1>
        <p className="mt-4 text-lg text-[#aaa99e] sm:text-xl">
          Books you added to the library.
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10 lg:px-12">
        <MyBooksTable />
      </section>
    </main>
  );
}