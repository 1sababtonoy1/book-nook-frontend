"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

const fieldClass =
  "h-14 rounded-xl border border-[#3a423d] bg-[#222925] px-4 text-base text-[#eeeae0] placeholder:text-[#8b948d]";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.4-4.7 7l7.3 5.7c4.3-4 6.8-9.9 6.8-17.2z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.3.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.7 2.3-8.6 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

const SignUpPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const busy = isSubmitting || isGoogleLoading;

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleEmailSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Better Auth returns errors instead of throwing them.
      const { error } = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        image: form.photoURL || undefined,
      });

      if (error) {
        toast.error(error.message || "Could not create your account.");
        return;
      }

      // Account created (and signed in) → go to the home page.
      toast.success("Account created successfully. Welcome to BookNook!");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);

    try {
      // Google handles both sign-up and sign-in: new users get an account
      // automatically, returning users are just logged in.
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        errorCallbackURL: "/register",
      });

      // On success the browser leaves for Google, so this only runs on failure.
      if (error) {
        toast.error(error.message || "Could not continue with Google.");
        setIsGoogleLoading(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#101612] px-6 py-12">
      <div className="w-full max-w-[560px] rounded-2xl border border-[#2c352f] bg-[#1a211d] p-8 sm:p-12">
        <h1 className="text-center font-serif text-4xl font-bold text-[#f1ece0] sm:text-5xl">
          Create an account
        </h1>

        <form onSubmit={handleEmailSignUp} className="mt-10 grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-base text-[#eeeae0]">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              className={fieldClass}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="text-base text-[#eeeae0]">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
              className={fieldClass}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="photoURL" className="text-base text-[#eeeae0]">
              Photo URL
            </Label>
            <Input
              id="photoURL"
              name="image"
              type="url"
              placeholder="https://..."
              value={form.photoURL}
              onChange={(e) => update("photoURL", e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="text-base text-[#eeeae0]">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
              className={fieldClass}
            />
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="mt-2 h-14 w-full rounded-xl bg-[#9ac8a0] text-lg font-medium text-[#101713] hover:bg-[#abd6b0]"
          >
            {isSubmitting ? "Registering…" : "Register"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-5">
          <span className="h-px flex-1 bg-[#2c352f]" />
          <span className="text-sm text-[#9aa39c]">OR</span>
          <span className="h-px flex-1 bg-[#2c352f]" />
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={handleGoogle}
          className="h-14 w-full gap-3 rounded-xl border-[#3a423d] bg-[#222925] text-lg font-medium text-[#eeeae0] hover:bg-[#2a322d] hover:text-[#eeeae0]"
        >
          <GoogleIcon />
          {isGoogleLoading ? "Redirecting to Google…" : "Continue with Google"}
        </Button>

        <p className="mt-8 text-center text-lg text-[#9aa39c]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#8fc99c] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignUpPage;