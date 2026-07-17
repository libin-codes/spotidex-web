import type { DownloadJob } from "./types";

export function connectDownloadProgress(
  jobId: string,
  onUpdate: (job: DownloadJob) => void,
): () => void {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const ws = new WebSocket(
    `${protocol}//${window.location.host}/api/download/${jobId}/status`,
  );

  ws.onmessage = (event) => {
    const job: DownloadJob = JSON.parse(event.data);
    onUpdate(job);
  };

  return () => ws.close();
}
