
import { cn, formatDuration } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Clock, Music } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

type tracksDownloadHeaderProps = {
  cover_url: string;
  title: string;
  subtitle: string;
  totalTracks: number;
  totalDuration: number;
  type: "Playlist" | "Album";

  selectedCount:number;
  isAllSelected: boolean;
  onToggleChange: () => void;
};

export default function TracksDownloadHeader({
  cover_url,
  title,
  subtitle,
  totalTracks,
  totalDuration,
  type,
  selectedCount,
  isAllSelected,
  onToggleChange
}: tracksDownloadHeaderProps) {
  return (
    <CardHeader className="sticky top-0 z-10 flex flex-col gap-4 p-0 pt-4 bg-card w-full">
      <div className="px-4 flex gap-2 justify-between w-full">
        <div className="flex gap-2">
          <Badge variant={"secondary"}>
            <Music />
            {totalTracks} Tracks
          </Badge>
          <Badge variant={"secondary"}>
            <Clock />
            {formatDuration(totalDuration)}
          </Badge>
        </div>
        <Badge variant={"secondary"}>{type}</Badge>
      </div>

      <div className="px-4 flex gap-2">
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

      <div
        className={cn(
          "flex justify-between items-center p-4 border-y bg-card w-full",
          isAllSelected && "bg-secondary",
        )}
        onClick={() => onToggleChange()}
      >
        <div className={cn("flex gap-4 font-medium items-center")}>
          <Checkbox checked={isAllSelected} onClick={() => onToggleChange()} />
          Toggle All
        </div>
        <div className="font-medium">
          Selected {selectedCount}/{totalTracks}
        </div>
      </div>
    </CardHeader>
  );
}
