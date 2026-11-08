import Link from "next/link";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";

const socialLinks = [
  { label: "X", href: "https://x.com", icon: "𝕏" },
  { label: "Facebook", href: "https://facebook.com", icon: "f" },
  { label: "Instagram", href: "https://instagram.com", icon: "◎" },
];

export default function Footer() {
  return (
    <footer className="bg-[#19251f] text-[#eeeae0]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 sm:px-10 md:grid-cols-3 md:gap-10 md:py-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid size-[60px] place-items-center rounded-xl bg-[#8fc99c] text-[#101713]">
              <BookOpen className="size-8" strokeWidth={1.8} />
            </span>
            <span className="font-serif text-4xl font-bold tracking-tight">
              BookNook
            </span>
          </Link>

          <p className="mt-6 max-w-[410px] text-lg leading-8 text-[#aaa99e]">
            A small neighbourhood library on the web. Share the books on your
            shelf and borrow the ones you have been meaning to read.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h2 className="font-serif text-3xl font-bold">Contact</h2>

          <address className="mt-7 space-y-5 text-lg not-italic text-[#aaa99e]">
            <a
              href="mailto:hello@booknook.app"
              className="flex items-center gap-4 transition-colors hover:text-[#eeeae0]"
            >
              <Mail className="size-6 shrink-0" />
              <span>hello@booknook.app</span>
            </a>

            <a
              href="tel:+8801700000000"
              className="flex items-center gap-4 transition-colors hover:text-[#eeeae0]"
            >
              <Phone className="size-6 shrink-0" />
              <span>+880 1700 000 000</span>
            </a>

            <p className="flex items-center gap-4">
              <MapPin className="size-6 shrink-0" />
              <span>12 Reading Lane, Dhaka</span>
            </p>
          </address>
        </div>

        {/* Social links */}
        <div>
          <h2 className="font-serif text-3xl font-bold">Follow us</h2>

          <div className="mt-7 flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="grid size-20 place-items-center rounded-full border border-[#303a34] bg-[#101713] text-3xl font-semibold transition-colors hover:border-[#8fc99c] hover:text-[#8fc99c]"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#303a34] px-6 py-7 text-center text-lg text-[#aaa99e]">
        © {new Date().getFullYear()} BookNook. All rights reserved.
      </div>
    </footer>
  );
}