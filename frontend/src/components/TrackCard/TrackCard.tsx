import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DownloadButton } from "@/components/DownloadButton";
import { Calendar, Clock, DiscAlbum } from "lucide-react";
import { useTrack } from "@/hooks/use-track";
import { useDownload } from "@/hooks/use-download";
import { TrackCardSkeleton } from "./TrackCardSkeleton";
import { useEffect } from "react";

type TrackCardProps = {
  trackId: string;
  onLoadingChange?: (isLoading: boolean) => void;
};

export function TrackCard({ trackId, onLoadingChange }: TrackCardProps) {
  const { data: track, isLoading } = useTrack(trackId);
  const {download, job} = useDownload()

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  if (isLoading) {
    return <TrackCardSkeleton />;
  }

  if (!track) {
    return "Failed to load track."
  }

  const minutes = Math.floor(track.duration_seconds / 60);
  const remainingSeconds = track.duration_seconds % 60;

  const formatedDuration = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;

  return (
    <Card className="max-w-sm p-4 " size="sm">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-center gap-2 justify-between px-1">
          <div className="flex min-w-0 items-center gap-2 overflow-hidden">
            {track.album_name && (
              <Badge variant="secondary" className="min-w-0 shrink truncate">
                <DiscAlbum />
                <span className="min-w-0 truncate">{track.album_name}</span>
              </Badge>
            )}
            <Badge variant="secondary" className="shrink-0">
              <Calendar data-icon="inline-start" />
              {track.year}
            </Badge>
          </div>
          <Badge variant="secondary" className="shrink-0">
            <Clock data-icon="inline-start" />
            {formatedDuration}
          </Badge>
        </div>
        <img
          src={track.cover_url}
          alt={`${track.name} cover`}
          className="z-20 aspect-square w-full rounded-2xl"
        />
      </CardContent>
      <div className="flex flex-col gap-4">
        <CardHeader className="gap-0 px-0 pl-1">
          <CardTitle className="truncate">{track.name}</CardTitle>
          <CardDescription className="truncate">
            {track.artists.join(", ")}
          </CardDescription>
        </CardHeader>

        <CardFooter className="gap-1 px-0"> 
      

          <DownloadButton
            job={job}
            onClick={() => {
              download(track);
            }}
            className="flex-1"
          />
        </CardFooter>
      </div>
    </Card>
  );
}