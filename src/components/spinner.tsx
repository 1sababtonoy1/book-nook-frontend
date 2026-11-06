import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      aria-label="Loading"
      className={cn("size-5 animate-spin text-[#9ac8a0]", className)}
    />
  );
}

export function PageLoader({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-[#101612]">
      <Spinner className="size-9" />
      {label && <p className="text-sm text-[#9aa39c]">{label}</p>}
    </div>
  );
}