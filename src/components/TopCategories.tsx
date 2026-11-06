import { Compass, Landmark, PenLine, Sprout } from "lucide-react";

const categories = [
  { name: "Fiction", count: "824 stories", icon: PenLine },
  { name: "Personal Growth", count: "316 reads", icon: Sprout },
  { name: "Travel", count: "208 journeys", icon: Compass },
  { name: "History", count: "192 discoveries", icon: Landmark },
];

export default function TopCategories() {
  return (
    <section className="bg-[#151b19] pb-16 sm:pb-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="rounded-[32px] border border-[#2c3a33] bg-[#1d2622] p-6 sm:p-10">
          {/* Heading */}
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f2a583]">
            A nook for every mood
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#f4f7f4] sm:text-4xl">
            Top categories
          </h2>

          {/* Category tiles */}
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {categories.map(({ name, count, icon: Icon }) => (
              <a
                key={name}
                href={`/books?category=${encodeURIComponent(name)}`}
                className="flex items-center gap-5 rounded-3xl bg-[#28352f] p-7 transition-colors hover:bg-[#2f3e37]"
              >
                <span className="grid size-[76px] shrink-0 place-items-center rounded-[22px] bg-[#44342c] text-[#f4f7f4]">
                  <Icon className="size-7" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">{name}</h3>
                  <p className="mt-1 text-base text-[#a9b8b0]">{count}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="mt-10 border-l-4 border-[#f2a583] py-1 pl-8">
            <p className="text-lg text-[#a9b8b0] sm:text-xl">
              “I found a book I’d been meaning to read for years, two streets from home.”
            </p>
            <footer className="mt-4 text-base font-bold text-white">
              — Jamie, BookNook reader
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}