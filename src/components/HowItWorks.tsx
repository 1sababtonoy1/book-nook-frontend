const steps = [
  {
    number: "01",
    title: "Find your book",
    description:
      "Browse community shelves and discover a story that calls to you.",
  },
  {
    number: "02",
    title: "Borrow with a tap",
    description: "Choose an available copy and keep it for up to 21 days.",
  },
  {
    number: "03",
    title: "Pass it along",
    description:
      "Return it when you're done so the next reader can enjoy it.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#151b19] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        {/* Heading */}
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f2a583]">
          Simple by design
        </p>
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-[#f4f7f4] sm:text-6xl">
          How borrowing works
        </h2>
        <p className="mt-5 text-lg text-[#a9b8b0] sm:text-xl">
          Good books travel farther when sharing them feels easy.
        </p>

        {/* Panel */}
        <div className="mt-12 rounded-[40px] border border-[#2c3a33] bg-[#1d2622] p-6 sm:p-10 lg:px-[52px] lg:pb-32 lg:pt-[100px]">
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-[28px] bg-[#28352f] p-7"
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-[#a9d4b6] text-xl font-extrabold text-[#17231d]">
                  {step.number}
                </span>

                <h3 className="mt-9 text-2xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-lg leading-relaxed text-[#a9b8b0]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}