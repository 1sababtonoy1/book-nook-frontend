import MyBorrowsTable from "@/components/MyBorrowsTable";

export default function MyBorrowsPage() {
  return (
    <main className="min-h-screen bg-[#0f1713] text-[#eeeae0]">
      <header className="border-b border-[#2a342e] bg-[#1b2520] px-6 py-16 text-center sm:py-20">
        <h1 className="font-serif text-5xl font-bold sm:text-6xl">My Borrows</h1>
        <p className="mt-4 text-lg text-[#aaa99e] sm:text-xl">
          Books you are reading right now.
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10 lg:px-12">
        <MyBorrowsTable />
      </section>
    </main>
  );
}