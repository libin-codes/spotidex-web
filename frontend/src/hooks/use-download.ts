import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { downloadTrack, downloadPlaylist, downloadAlbum, getDownloadFileUrl } from "@/api/client";
import { connectDownloadProgress } from "@/api/websocket";
import type { TrackModel, PlaylistModel, AlbumModel, DownloadJob } from "@/api/types";
import type { DownloadStatus } from "@/components/DownloadButton";

export function useDownload() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>({
    status: "idle",
  });

  const trackMutation = useMutation({
    mutationFn: downloadTrack,
    onSuccess: (data) => {
      setJobId(data.job_id);
      setDownloadStatus({ status: "downloading", progress: 0 });
    },
    onError: () => {
      setDownloadStatus({ status: "failed" });
    },
  });

  const playlistMutation = useMutation({
    mutationFn: downloadPlaylist,
    onSuccess: (data) => {
      setJobId(data.job_id);
      setDownloadStatus({ status: "downloading", progress: 0 });
    },
    onError: () => {
      setDownloadStatus({ status: "failed" });
    },
  });

  const albumMutation = useMutation({
    mutationFn: downloadAlbum,
    onSuccess: (data) => {
      setJobId(data.job_id);
      setDownloadStatus({ status: "downloading", progress: 0 });
    },
    onError: () => {
      setDownloadStatus({ status: "failed" });
    },
  });

  useEffect(() => {
    if (!jobId) return;

    return connectDownloadProgress(jobId, (job: DownloadJob) => {
      if (job.status === "completed") {
        setDownloadStatus({ status: "completed" });
        window.location.href = getDownloadFileUrl(jobId);
      } else if (job.status === "failed") {
        setDownloadStatus({ status: "failed" });
      } else if (job.status === "downloading") {
        const activeTrack = job.tracks.find((t) => t.status === "downloading");
        const percent = activeTrack
          ? Math.round(activeTrack.percent)
          : 0;
        setDownloadStatus({ status: "downloading", progress: percent });
      }
    });
  }, [jobId]);

  const download = useCallback(
    (track: TrackModel) => trackMutation.mutate(track),
    [trackMutation],
  );

  const downloadPlaylistTrack = useCallback(
    (playlist: PlaylistModel) => playlistMutation.mutate(playlist),
    [playlistMutation],
  );

  const downloadAlbumTrack = useCallback(
    (album: AlbumModel) => albumMutation.mutate(album),
    [albumMutation],
  );

  const reset = useCallback(() => {
    setJobId(null);
    setDownloadStatus({ status: "idle" });
    trackMutation.reset();
    playlistMutation.reset();
    albumMutation.reset();
  }, [trackMutation, playlistMutation, albumMutation]);

  return {
    downloadStatus,
    download,
    downloadPlaylist: downloadPlaylistTrack,
    downloadAlbum: downloadAlbumTrack,
    reset,
    isPending: trackMutation.isPending || playlistMutation.isPending || albumMutation.isPending,
  };
}