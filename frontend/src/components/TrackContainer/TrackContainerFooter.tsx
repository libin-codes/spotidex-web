import { CardFooter } from "../ui/card";
import { DownloadButton } from "@/components/DownloadButton";
import type { DownloadJob } from "@/api/types";

type TrackContainerFooterProps = {
  job?: DownloadJob | null;
  onDownloadClick?: () => void;
  selectedCount:number;
};

export default function TrackContainerFooter({
  job,
  onDownloadClick,
  selectedCount
}: TrackContainerFooterProps) {
  return (
    <CardFooter className="sticky bottom-0 z-10 gap-1 border-t pb-4  bg-card ">
  

      <DownloadButton
        job={job}
        onClick={onDownloadClick}
        className="flex-1"
        disabled={selectedCount === 0}
      />
    </CardFooter>
  );
}