import { Card } from "@/components/ui/card";
import TrackContainerHeader from "@/components/TrackContainer/TrackContainerHeader";
import TrackItemList from "@/components/TrackContainer/TrackItemList";
import { useState } from "react";
import type { TrackModel, TrackDownloadProgress, DownloadJob } from "@/api/types";

const mockTrack: TrackModel = {
  spotify_id: "demo",
  name: "Bohemian Rhapsody",
  cover_url: "https://picsum.photos/seed/br/64",
  artists: ["Queen"],
  album_name: "A Night at the Opera",
  year: "1975",
  youtube_id: "",
  duration_seconds: 354,
};

const MOCK_TRACKS: TrackModel[] = [
  { ...mockTrack, spotify_id: "idle-1", name: "Idle Unselected", duration_seconds: 180 },
  { ...mockTrack, spotify_id: "idle-2", name: "Idle Selected", duration_seconds: 200 },
  { ...mockTrack, spotify_id: "demo-pending", name: "Pending Track", duration_seconds: 220 },
  { ...mockTrack, spotify_id: "demo-dl", name: "Downloading Track", duration_seconds: 240 },
  { ...mockTrack, spotify_id: "demo-completed", name: "Completed Track", duration_seconds: 260 },
  { ...mockTrack, spotify_id: "demo-failed", name: "Failed Track", duration_seconds: 280 },
];

const MOCK_JOB_TRACKS: TrackDownloadProgress[] = [
  {
    spotify_id: "demo-pending",
    name: "Pending Track",
    artists: ["Queen"],
    status: "pending",
    percent: 0,
    error: null,
    duration_seconds: 220,
  },
  {
    spotify_id: "demo-dl",
    name: "Downloading Track",
    artists: ["Queen"],
    status: "downloading",
    percent: 62,
    error: null,
    duration_seconds: 240,
  },
  {
    spotify_id: "demo-completed",
    name: "Completed Track",
    artists: ["Queen"],
    status: "completed",
    percent: 100,
    error: null,
    duration_seconds: 260,
  },
  {
    spotify_id: "demo-failed",
    name: "Failed Track",
    artists: ["Queen"],
    status: "failed",
    percent: 0,
    error: "Something went wrong",
    duration_seconds: 280,
  },
];

const MOCK_JOB: DownloadJob = {
  job_id: "demo-job",
  name: "Demo Download",
  type: "playlist",
  status: "downloading",
  total: 4,
  completed: 1,
  failed: 1,
  tracks: MOCK_JOB_TRACKS,
  created_at: new Date().toISOString(),
  overall_progress: 40.5,
};

export default function TrackItemDemo() {
  const [selectedIds] = useState(() => new Set(["idle-2"]));

  return (
    <div className="flex h-full flex-col p-4 gap-4 max-w-lg mx-auto">
      <Card className="w-full p-0 gap-0" size="sm">
        <TrackContainerHeader
          title="TrackItem States Demo"
          subtitle="All 6 visual states"
          cover_url="https://picsum.photos/seed/demo/64"
          totalTracks={MOCK_TRACKS.length}
          isAllSelected={false}
          onToggleChange={() => {}}
          selectedCount={0}
          job={MOCK_JOB}
        />
        <TrackItemList
          tracks={MOCK_TRACKS}
          onToggle={() => {}}
          selectedIds={selectedIds}
          jobTracks={MOCK_JOB_TRACKS}
        />
      </Card>

      <p className="text-sm text-muted-foreground text-center">
        Order: downloading (62%) → pending → completed → failed → idle (unselected) → idle (selected)
      </p>
    </div>
  );
}