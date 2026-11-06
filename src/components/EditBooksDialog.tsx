"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

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

const fieldClass = "h-12 border border-[#3a423d] bg-[#1b2420] text-[#eeeae0]";

function formFromBook(book: Book) {
  return {
    title: book.title,
    author: book.author,
    category: book.category,
    copies: String(book.copies),
    imageUrl: book.imageUrl ?? "",
    description: book.description ?? "",
  };
}

type Props = {
  book: Book;
  onSaved: (book: Book) => void;
};

const EditBooksDialog = ({ book, onSaved }: Props) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => formFromBook(book));
  const [isSaving, setIsSaving] = useState(false);

  // Keep the book's current category selectable even if it isn't in the list.
  const categoryOptions =
    !form.category || categories.includes(form.category)
      ? categories
      : [form.category, ...categories];

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  // Start from the book's latest values every time the dialog opens.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setForm(formFromBook(book));
    }
    setOpen(next);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = { ...form, copies: Number(form.copies) };

      const res = await authFetch(`/books/${book._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Could not save the changes.");

      const saved = data?.book ?? data;
      onSaved(saved && saved._id ? { ...book, ...saved } : { ...book, ...payload });

      toast.success(`"${form.title}" updated successfully.`);
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "border-[#3a423d] bg-transparent text-[#eeeae0] hover:bg-[#18211c]",
        )}
      >
        Edit
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] overflow-y-auto border-[#303a34] bg-[#1b2420] text-[#eeeae0] sm:max-w-[34rem]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Edit book</DialogTitle>
          <DialogDescription className="sr-only">
            Update the details of this book.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`title-${book._id}`}>Book Title</Label>
              <Input
                id={`title-${book._id}`}
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                required
                className={fieldClass}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`author-${book._id}`}>Author Name</Label>
              <Input
                id={`author-${book._id}`}
                value={form.author}
                onChange={(e) => update("author", e.target.value)}
                required
                className={fieldClass}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`category-${book._id}`}>Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) => update("category", value ?? "")}
              >
                <SelectTrigger
                  id={`category-${book._id}`}
                  className={`w-full ${fieldClass}`}
                >
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`copies-${book._id}`}>Total Copies</Label>
              <Input
                id={`copies-${book._id}`}
                type="number"
                min="0"
                value={form.copies}
                onChange={(e) => update("copies", e.target.value)}
                required
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`image-${book._id}`}>Book Image URL</Label>
            <Input
              id={`image-${book._id}`}
              type="url"
              placeholder="https://example.com/book-cover.jpg"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`description-${book._id}`}>Short Description</Label>
            <Textarea
              id={`description-${book._id}`}
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="min-h-24 border border-[#3a423d] bg-[#1b2420] text-[#eeeae0]"
            />
          </div>

          {/* The owner can't be changed, so these are display-only. */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`userName-${book._id}`}>User Name</Label>
              <Input
                id={`userName-${book._id}`}
                value={book.userName ?? ""}
                readOnly
                className={fieldClass}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`userEmail-${book._id}`}>User Email</Label>
              <Input
                id={`userEmail-${book._id}`}
                value={book.userEmail ?? ""}
                readOnly
                className={fieldClass}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="h-12 w-full bg-[#9ed4a9] text-base font-medium text-[#101713] hover:bg-[#b3e3bd]"
          >
            {isSaving ? "Saving…" : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBooksDialog;