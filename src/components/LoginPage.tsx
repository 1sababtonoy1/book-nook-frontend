"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

const fieldClass =
  "h-12 rounded-xl border border-[#3a423d] bg-[#222925] px-4 text-base text-[#eeeae0] placeholder:text-[#8b948d]";

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

const LoginPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");

  const busy = isSubmitting || isGoogleLoading;

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      // Better Auth returns errors instead of throwing them.
      const { error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setMessage(error.message || "Invalid email or password.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    setMessage("");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        errorCallbackURL: "/login",
      });

      // On success the browser leaves for Google, so this only runs on failure.
      if (error) {
        setMessage(error.message || "Could not continue with Google.");
        setIsGoogleLoading(false);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#101612] px-6 py-12">
      <div className="w-full max-w-[480px] rounded-2xl border border-[#2c352f] bg-[#1a211d] p-8 sm:p-12">
        <h1 className="text-center font-serif text-4xl font-bold text-[#f1ece0] sm:text-5xl">
          Login
        </h1>

        <form onSubmit={handleLogin} className="mt-8 grid gap-5">
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
            <Label htmlFor="password" className="text-base text-[#eeeae0]">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
              className={fieldClass}
            />
          </div>

          <Link
            href="/forgot-password"
            className="w-fit text-base text-[#8fc99c] hover:underline"
          >
            Forget Password?
          </Link>

          <Button
            type="submit"
            disabled={busy}
            className="h-12 w-full rounded-xl bg-[#9ac8a0] text-base font-medium text-[#101713] hover:bg-[#abd6b0]"
          >
            {isSubmitting ? "Logging in…" : "Login"}
          </Button>

          {message && (
            <p role="alert" className="text-center text-sm text-[#f08a8a]">
              {message}
            </p>
          )}
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-5">
          <span className="h-px flex-1 bg-[#2c352f]" />
          <span className="text-sm text-[#9aa39c]">OR</span>
          <span className="h-px flex-1 bg-[#2c352f]" />
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={handleGoogle}
          className="h-12 w-full gap-3 rounded-xl border-[#3a423d] bg-[#222925] text-base font-medium text-[#eeeae0] hover:bg-[#2a322d] hover:text-[#eeeae0]"
        >
          <GoogleIcon />
          {isGoogleLoading ? "Redirecting to Google…" : "Continue with Google"}
        </Button>

        <p className="mt-6 text-center text-base text-[#9aa39c]">
          New here?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#8fc99c] hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;