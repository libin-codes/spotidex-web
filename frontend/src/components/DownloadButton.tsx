import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Loader2, Download, X } from "lucide-react";

export type DownloadStatus =
  | { status: "idle" }
  | { status: "downloading"; progress: number }
  | { status: "completed" }
  | { status: "failed" };

type DownloadButtonProps = {
  status?: DownloadStatus;
  onClick?: () => void;
  className?: string;
};

export function DownloadButton({
  status = { status: "idle" },
  onClick,
  className,
}: DownloadButtonProps) {
  const s = status.status;
  const progress = s === "downloading" ? Math.min(100, Math.max(0, status.progress)) : 0;

  return (
    <Button
      variant={s === "idle" || s === "failed" ? "default" : "outline"}
      size="lg"
      className={cn(
        "relative overflow-hidden disabled:opacity-100",
        s === "completed" && "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
        s === "failed" && "bg-destructive/15 text-destructive dark:bg-destructive/20 dark:text-destructive",
        className
      )}
      onClick={onClick}
      disabled={s === "downloading" || s === "completed"}
    >
      {s === "downloading" && (
        <span
          className="absolute inset-0 bg-primary/75 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-1.5">
        {s === "idle" && <Download data-icon="inline-start" />}
        {s === "downloading" && <Loader2 className="animate-spin" data-icon="inline-start" />}
        {s === "completed" && <Check data-icon="inline-start" />}
        {s === "failed" && <X data-icon="inline-start" />}
        {s === "downloading" && `${progress}% `}
        {s === "idle" && "Download"}
        {s === "downloading" && "Downloading"}
        {s === "completed" && "Completed"}
        {s === "failed" && "Failed"}
      </span>
    </Button>
  );
}
