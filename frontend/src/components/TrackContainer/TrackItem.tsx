import type { TrackDownloadProgress, TrackModel } from "@/api/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn, getTrackDurationString } from "@/lib/utils";
import { Check, Clock, Loader2, X } from "lucide-react";

type TrackItemProps = {
  track: TrackModel;
  isSelected: boolean;
  onSelectChange?: (isSelected: boolean) => void;
  trackStatus?: TrackDownloadProgress | "idle";
};

export default function TrackItem({
  track,
  isSelected,
  onSelectChange,
  trackStatus = "idle",
}: TrackItemProps) {

  const status = trackStatus === "idle" ? "idle" : trackStatus.status;
  const percent = trackStatus !== "idle" ? Math.round(trackStatus.percent) : 0;

  return (
    <Item
      variant="outline"
      className={cn(
        "border-0 p-3 px-4 rounded-none relative ",
        status !== "idle" && "border-b",
        status === "idle" && "cursor-pointer",
        status === "idle" && isSelected && "bg-secondary",
        status === "pending" && "bg-yellow-500/20",
        status === "completed" && "bg-green-500/20",
        status === "failed" && "bg-red-500/20",
      )}
      onClick={()=>{
        if (status==="idle"){
          onSelectChange?.(!isSelected);
        }
      }}
    >
      {status === "downloading" && (
        <span
          className="absolute inset-0 bg-green-500/20 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      )}

      {status === "idle" && (
        <Checkbox
          checked={isSelected}
          onClick={() => onSelectChange?.(!isSelected)}
        />
      )}

      <ItemMedia variant="image">
        <img src={track.cover_url} alt={"Cover Art"} />
      </ItemMedia>

      <>
        <ItemContent className="gap-0 pt-0 z-10 ">
          <ItemTitle className="line-clamp-1">{track.name}</ItemTitle>
          <ItemDescription className="line-clamp-1">
            {track.artists.toString()}
          </ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center z-10">
          <ItemDescription
            className={cn(
              "flex items-center gap-1 ",
              status === "downloading" && "text-white",
              status === "pending" && "text-yellow-500",
              status === "completed" && "text-emerald-500",
              status === "failed" && "text-red-500",
            )}
          >
            {status === "idle" && getTrackDurationString(track.duration_seconds)}
            {status === "downloading" && (
              <Loader2 className="size-3 animate-spin" />
            )}
            {status === "downloading" && `${percent}%`}
            {status === "pending" && <Clock className="size-4" />}

            {status === "completed" && <Check className="size-4" />}
            {status === "failed" && <X className="size-4" />}
          </ItemDescription>
        </ItemContent>
      </>
    </Item>
  );
}
