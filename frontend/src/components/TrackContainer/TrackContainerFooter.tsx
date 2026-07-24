import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { DownloadButton } from "@/components/DownloadButton";
import { Settings } from "lucide-react";
import type { DownloadJob } from "@/api/types";

type TrackContainerFooterProps = {
  job?: DownloadJob | null;
  onDownloadClick?: () => void;
};

export default function TrackContainerFooter({
  job,
  onDownloadClick,
}: TrackContainerFooterProps) {
  return (
    <CardFooter className="sticky bottom-0 z-10 gap-1 border-t pb-4  bg-card ">
      <Button variant="secondary" size="icon-lg">
        <Settings />
      </Button>
      <DownloadButton job={job} onClick={onDownloadClick} className="flex-1" />
    </CardFooter>
  );
}