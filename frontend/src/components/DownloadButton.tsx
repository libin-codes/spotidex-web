import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Loader2, Download, X } from "lucide-react";
import type { DownloadJob } from "@/api/types";

type DownloadButtonProps = {
  job?: DownloadJob | null;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export function DownloadButton({
  job = null,
  disabled=false,
  onClick,
  className,
}: DownloadButtonProps) {
  const status = job?.status ?? null;
  const progress = status === "downloading"
    ? Math.min(100, Math.max(0, Math.round(job!.overall_progress)))
    : 0;

  return (
    <Button
      variant={status === null || status === "failed" ? "default" : "outline"}
      size="lg"
      className={cn(
        "relative overflow-hidden disabled:opacity-100",
        status === "completed" &&
          "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
        status === "failed" &&
          "bg-destructive/15 text-destructive dark:bg-destructive/20 dark:text-destructive",
        status === null && disabled && "disabled:opacity-60",
        className,
      )}
      onClick={onClick}
      disabled={status === "downloading" || status === "completed" || disabled}
    >
      {status === "downloading" && (
        <span
          className="absolute inset-0 bg-primary/75 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-1.5">
        {status === null && <Download data-icon="inline-start" />}
        {status === "downloading" && (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        )}
        {status === "completed" && <Check data-icon="inline-start" />}
        {status === "failed" && <X data-icon="inline-start" />}
        {status === "downloading" && `${progress}% `}
        {status === null && "Download"}
        {status === "downloading" && "Downloading"}
        {status === "completed" && "Completed"}
        {status === "failed" && "Failed"}
      </span>
    </Button>
  );
}