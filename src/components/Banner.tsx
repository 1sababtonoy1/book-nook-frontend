"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// To change the homepage hero, edit this list:
// one object = one slide (image, small label, headline, text, button).
const slides = [
  {
    image: "/images/hero/hero-1.jpg",
    eyebrow: "BookNook",
    title: "Borrow, read, return. Repeat.",
    subtitle: "Seven days for every book. Return it with one click when you are done.",
    cta: { label: "Browse Books", href: "/books" },
  },
  {
    image: "/images/hero/hero-2.jpg",
    eyebrow: "BookNook",
    title: "Your neighbourhood library, online",
    subtitle: "Find a book that someone nearby already loved, and borrow it for a week.",
    cta: { label: "Browse Books", href: "/books" },
  },
  {
    image: "/images/hero/hero-3.jpg",
    eyebrow: "BookNook",
    title: "Share the books on your shelf",
    subtitle: "Add the books you have finished. Let other readers enjoy them too.",
    cta: { label: "Browse Books", href: "/books" },
  },
];

const SLIDE_MS = 6000;

export default function Banner() {
  const [index, setIndex] = useState(0);

  // Move to the next slide after a delay. Clicking a dot restarts the timer.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <section className="relative h-[440px] w-full overflow-hidden bg-black sm:h-[480px] lg:h-[560px]">
      {slides.map((slide, i) => (
        <div
          key={slide.image}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />

          {/* Dark overlay, strongest on the left behind the text */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />

          <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6 lg:px-12">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand">
              {slide.eyebrow}
            </p>

            <h1 className="mt-5 max-w-2xl font-serif text-4xl font-bold leading-[1.15] text-white sm:text-5xl lg:text-6xl">
              {slide.title}
            </h1>

            <p className="mt-6 max-w-xl text-base text-white/90 sm:text-lg">
              {slide.subtitle}
            </p>

            <div className="mt-8">
              <Link
                href={slide.cta.href}
                tabIndex={i === index ? 0 : -1}
                className={cn(buttonVariants(), "h-11 px-5 text-base font-medium")}
              >
                {slide.cta.label}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Slide dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "size-2.5 rounded-full transition-colors",
              i === index ? "bg-brand" : "bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </section>
  );
}