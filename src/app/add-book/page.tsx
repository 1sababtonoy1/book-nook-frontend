"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { PackageCheck, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/client-api";

const categories = [
  "Fiction",
  "Non-fiction",
  "Mystery",
  "Fantasy",
  "Science fiction",
  "Biography",
  "Other",
];

const initialForm = {
  title: "",
  author: "",
  category: "",
  copies: "1",
  imageUrl: "",
  description: "",
};

const fieldClass =
  "h-14 border-2 border-[#3a423d] bg-[#18211c] text-[#eeeae0]";

export default function AddBookPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const update = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.category) {
      setMessage("Please choose a category.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await authFetch("/add-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, copies: Number(form.copies) }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Could not add the book.");
      }

      setMessage("Book added successfully.");
      setForm(initialForm);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setMessage("");
  };

  if (!isPending && !user) {
    return (
      <main className="min-h-screen bg-[#0d1511] px-6 py-12 text-[#eeeae0]">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#303a34] bg-[#111a15] px-6 py-16 text-center">
          <p className="text-lg text-[#aaa99e]">Please log in to add a book.</p>
          <Link
            href="/login"
            className="mt-4 inline-block font-semibold text-[#8fc99c] hover:underline"
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

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

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#303a34] bg-[#111a15] p-6 sm:p-10"
        >
          <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                required
                className={fieldClass}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="author">Author Name</Label>
              <Input
                id="author"
                value={form.author}
                onChange={(event) => update("author", event.target.value)}
                required
                className={fieldClass}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) => update("category", value ?? "")}
              >
                <SelectTrigger id="category" className={`w-full ${fieldClass}`}>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="copies">Total Copies</Label>
              <Input
                id="copies"
                type="number"
                min="1"
                value={form.copies}
                onChange={(event) => update("copies", event.target.value)}
                required
                className={fieldClass}
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="imageUrl">Book Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/book-cover.jpg"
                value={form.imageUrl}
                onChange={(event) => update("imageUrl", event.target.value)}
                className={fieldClass}
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                className="min-h-32 border-2 border-[#3a423d] bg-[#18211c] text-[#eeeae0]"
              />
            </div>

            
            <div className="grid gap-2">
              <Label htmlFor="userName">User Name</Label>
              <Input
                id="userName"
                value={user?.name ?? ""}
                readOnly
                className={fieldClass}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="userEmail">User Email</Label>
              <Input
                id="userEmail"
                type="email"
                value={user?.email ?? ""}
                readOnly
                className={fieldClass}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-[#3a423d] bg-transparent text-[#eeeae0] hover:bg-[#18211c]"
            >
              <Trash2 />
              Clear Form
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !user}
              className="bg-[#8fc99c] text-[#101713] hover:bg-[#a2d6ad]"
            >
              <PackageCheck />
              {isSubmitting ? "Adding Book..." : "Add Book"}
            </Button>
          </div>

          {message && (
            <p role="status" className="mt-4 text-right text-sm text-[#aaa99e]">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}