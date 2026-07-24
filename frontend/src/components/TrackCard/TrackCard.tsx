import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DownloadButton} from "@/components/DownloadButton";
import { Calendar, Clock, DiscAlbum, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useTrack } from "@/hooks/use-track";
import { useDownload } from "@/hooks/use-download";

type TrackCardProps = {
  trackId: string;
};

export function TrackCard({ trackId}: TrackCardProps) {
  const { data: track, isLoading } = useTrack(trackId);
  const {download, job} = useDownload()



  if (isLoading){
    return "Loading..."
  }

  if (!track) {
    return "Failed to load track."
  }

  const minutes = Math.floor(track.duration_seconds / 60);
  const remainingSeconds = track.duration_seconds % 60;

  const formatedDuration = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;

  return (
    <Card className="max-w-sm p-4" size="sm">
      <CardContent className="p-0 space-y-4">
        <div className="flex gap-2 justify-between px-1">
          <div className="space-x-2">
            {track.album_name && (
              <Badge variant="secondary" className="truncate">
                <DiscAlbum />
                {track.album_name}
              </Badge>
            )}
            <Badge variant="secondary">
              <Calendar data-icon="inline-start" />
              {track.year}
            </Badge>
          </div>
          <Badge variant="secondary">
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

      <CardHeader className="gap-0 px-0 pl-1">
        <CardTitle className="truncate">{track.name}</CardTitle>
        <CardDescription className="truncate">
          {track.artists.join(", ")}
        </CardDescription>
      </CardHeader>

      <CardFooter className="gap-1 px-0">
        <Button variant={"secondary"} size={"icon"}>
          <Settings />
        </Button>
        <DownloadButton
          job={job}
          onClick={() => {
            download(track);
          }}
          className="flex-1"
        />
      </CardFooter>
    </Card>
  );
}