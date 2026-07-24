import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { downloadTrack, downloadPlaylist, downloadAlbum, getDownloadFileUrl } from "@/api/client";
import { connectDownloadProgress } from "@/api/websocket";
import type { TrackModel, PlaylistModel, AlbumModel, DownloadJob } from "@/api/types";

export function useDownload() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<DownloadJob | null>(null);

  const trackMutation = useMutation({
    mutationFn: downloadTrack,
    onSuccess: (data) => {
      setJobId(data.job_id);
      setJob(null);
    },
    onError: () => {
      setJob(null);
    },
  });

  const playlistMutation = useMutation({
    mutationFn: downloadPlaylist,
    onSuccess: (data) => {
      setJobId(data.job_id);
      setJob(null);
    },
    onError: () => {
      setJob(null);
    },
  });

  const albumMutation = useMutation({
    mutationFn: downloadAlbum,
    onSuccess: (data) => {
      setJobId(data.job_id);
      setJob(null);
    },
    onError: () => {
      setJob(null);
    },
  });

  useEffect(() => {
    if (!jobId) return;

    return connectDownloadProgress(jobId, (updatedJob: DownloadJob) => {
      if (updatedJob.status === "completed") {
        window.location.href = getDownloadFileUrl(jobId);
      }
      setJob(updatedJob);
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
    setJob(null);
    trackMutation.reset();
    playlistMutation.reset();
    albumMutation.reset();
  }, [trackMutation, playlistMutation, albumMutation]);

  return {
    job,
    download,
    downloadPlaylist: downloadPlaylistTrack,
    downloadAlbum: downloadAlbumTrack,
    reset,
    isPending: trackMutation.isPending || playlistMutation.isPending || albumMutation.isPending,
  };
}