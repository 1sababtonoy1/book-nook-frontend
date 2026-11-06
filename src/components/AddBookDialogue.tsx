"use client";

import { useState, type FormEvent } from "react";
import { PackageCheck, Plus } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import type { Book } from "@/components/BookDetailsCard";
import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/client-api";
import { cn } from "@/lib/utils";

const categories = [
  "Fiction",
  "Non-fiction",
  "Mystery",
  "Fantasy",
  "Science fiction",
  "Biography",
  "Other",
];

const emptyForm = {
  title: "",
  author: "",
  category: "",
  copies: "1",
  imageUrl: "",
  description: "",
};

const fieldClass = "h-12 border border-[#3a423d] bg-[#1b2420] text-[#eeeae0]";

export default function AddBookDialog({
  onAdded,
}: {
  onAdded: (book: Book) => void;
}) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  // Start with a blank form every time the dialog opens.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setForm(emptyForm);
      setError("");
    }
    setOpen(next);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.category) {
      setError("Please choose a category.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const payload = { ...form, copies: Number(form.copies) };

      const res = await authFetch("/add-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.insertedId) {
        throw new Error(data.message || "Could not add the book.");
      }

      // The server only returns the new id, so build the book locally.
      onAdded({
        ...payload,
        _id: String(data.insertedId),
        userName: user?.name,
        userEmail: user?.email,
      });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className={cn(
          buttonVariants(),
          "h-11 gap-2 bg-[#9ed4a9] px-5 font-medium text-[#101713] hover:bg-[#b3e3bd]",
        )}
      >
        <Plus className="size-4" />
        Add Book
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] overflow-y-auto border-[#303a34] bg-[#1b2420] text-[#eeeae0] sm:max-w-[34rem]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Add a book</DialogTitle>
          <DialogDescription className="text-[#aaa99e]">
            Put a book from your shelf into the library.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="add-title">Book Title</Label>
              <Input
                id="add-title"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                required
                className={fieldClass}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="add-author">Author Name</Label>
              <Input
                id="add-author"
                value={form.author}
                onChange={(e) => update("author", e.target.value)}
                required
                className={fieldClass}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="add-category">Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) => update("category", value ?? "")}
              >
                <SelectTrigger id="add-category" className={`w-full ${fieldClass}`}>
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
              <Label htmlFor="add-copies">Total Copies</Label>
              <Input
                id="add-copies"
                type="number"
                min="1"
                value={form.copies}
                onChange={(e) => update("copies", e.target.value)}
                required
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="add-imageUrl">Book Image URL</Label>
            <Input
              id="add-imageUrl"
              type="url"
              placeholder="https://example.com/book-cover.jpg"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="add-description">Short Description</Label>
            <Textarea
              id="add-description"
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="min-h-24 border border-[#3a423d] bg-[#1b2420] text-[#eeeae0]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="add-userName">User Name</Label>
              <Input
                id="add-userName"
                value={user?.name ?? ""}
                readOnly
                className={fieldClass}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="add-userEmail">User Email</Label>
              <Input
                id="add-userEmail"
                type="email"
                value={user?.email ?? ""}
                readOnly
                className={fieldClass}
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-[#f08a8a]">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSaving}
            className="h-12 w-full gap-2 bg-[#9ed4a9] text-base font-medium text-[#101713] hover:bg-[#b3e3bd]"
          >
            <PackageCheck className="size-5" />
            {isSaving ? "Adding Book…" : "Add Book"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}