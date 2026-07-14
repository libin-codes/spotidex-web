import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, DiscAlbum, Settings } from "lucide-react";

type TrackCardProps = {
  image: string;
  title: string;
  artist: string;
  album: string;
  year: number | string;
  onDownloadClick: () => void;
  onSettingsClick: () => void;
};

export function TrackCard({
  image = "https://i.scdn.co/image/ab67616d0000b2737359994525d219f64872d3b1",
  title = "Cut To The Feeling",
  artist = "Carly Rae Jepsen",
  album,
  year = 2018,
  onDownloadClick,
  onSettingsClick,
}: TrackCardProps) {
  return (
    <Card className="max-w-sm p-4" size="sm">
      <CardContent className="p-0 space-y-4">
        <img
          src={image}
          alt={`${title} cover`}
          className="z-20 aspect-square w-full rounded-2xl"
        />
        <div className="flex gap-2">
          {album && (
            <Badge variant="outline" className="truncate">
              <DiscAlbum data-icon="inline-start" />
              {album}
            </Badge>
          )}
          <Badge variant="outline">
            <Calendar data-icon="inline-start" />
            {year}
          </Badge>
        </div>
      </CardContent>

      <CardHeader className="gap-0 px-0">
        <CardTitle className="truncate">{title}</CardTitle>
        <CardDescription className="truncate">{artist}</CardDescription>
      </CardHeader>
      <CardFooter className="gap-1 px-0">
        {onSettingsClick && (
          <Button variant="secondary" size="icon-lg" onClick={onSettingsClick}>
            <Settings />
          </Button>
        )}
        <Button className="flex-1" size="lg" onClick={onDownloadClick}>
          Download Track
        </Button>
      </CardFooter>
    </Card>
  );
}
