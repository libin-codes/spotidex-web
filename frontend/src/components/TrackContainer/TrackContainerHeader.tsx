import { cn } from "@/lib/utils";
import { CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Check, X } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import type { DownloadJob } from "@/api/types";

type TrackContainerHeaderProps = {
  cover_url: string;
  title: string;
  subtitle: string;
  totalTracks: number;
  selectedCount: number;
  isAllSelected: boolean;
  onToggleChange: () => void;
  job?: DownloadJob | null;
};

export default function TrackContainerHeader({
  cover_url,
  title,
  subtitle,
  totalTracks,
  selectedCount,
  isAllSelected,
  onToggleChange,
  job,
}: TrackContainerHeaderProps) {
  const isJobActive =
    !!job &&
    (job.status === "downloading" ||
      job.status === "completed" ||
      job.status === "failed");

  return (
    <CardHeader className="sticky top-0 z-10 flex flex-col gap-4 p-0 pt-4 bg-card w-full">
   

      <div className="px-4 flex gap-4">
        <img
          src={cover_url}
          alt={`${title} cover`}
          className="size-12 shrink-0 rounded-2xl object-cover"
        />

        <div className="w-full">
          <CardTitle className="truncate flex justify-between w-full items-center">
            {title}
          </CardTitle>
          <CardDescription className="truncate">{subtitle}</CardDescription>
        </div>
      </div>

      {isJobActive ? (
        <div className="flex justify-between items-center p-4 border-y bg-card w-full">
          <div className="flex gap-2 items-center text-red-500/70 font-semibold">
            <X className="size-4" />
            Failed {job!.failed}
          </div>
          <div className="flex justify-center items-center gap-2 text-green-500/70 font-medium">
            <Check className="size-4" />
            success {job!.completed}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex justify-between items-center p-4 border-y bg-card w-full",
            isAllSelected && "bg-secondary",
          )}
          onClick={() => onToggleChange()}
        >
          <div className={cn("flex gap-4 font-medium items-center")}>
            <Checkbox
              checked={isAllSelected}
              onClick={() => onToggleChange()}
            />
            Toggle All
          </div>
          <div className="font-medium">
            Selected {selectedCount}/{totalTracks}
          </div>
        </div>
      )}
    </CardHeader>
  );
}