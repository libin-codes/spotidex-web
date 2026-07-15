"use client";


import { Card } from "@/components/ui/card";
import TrackItem from "./TrackSelectionItem";
import { Separator } from "../ui/separator";
import TrackSelectionList from "./TrackSelectionList";
import type { Track } from "./types";
import TracksDownloadHeader from "./TracksDownloadHeader";
import TracksDownloadFooter from "./TracksDownloadFooter";
import type { DownloadStatus } from "@/components/DownloadButton";

export type TrackItem = {
  id: string;
  image?: string;
  title: string;
  artist: string;
};

type TrackListCardProps = {
  image?: string;
  title?: string;
  subtitle?: string;
  trackCount?: number;
  items: Track[];
  onDownloadClick?: (selectedIds: string[]) => void;
  onSettingsClick?: () => void;
  downloadStatus?: DownloadStatus;
};

export function TrackListCard({
  image = "https://i.scdn.co/image/ab67616d0000b2737359994525d219f64872d3b1",
  title = "Playlist Name",
  subtitle = "Creator Name",
  items,
  downloadStatus,
}: TrackListCardProps) {
  return (
    <Card className="w-full" size="sm">
      <TracksDownloadHeader
        title={title}
        subtitle={subtitle}
        cover_url={image}
      />
      <Separator />
      <TrackSelectionList tracks={items} />
      <Separator />
      <TracksDownloadFooter downloadStatus={downloadStatus} />
    </Card>
  );
}
