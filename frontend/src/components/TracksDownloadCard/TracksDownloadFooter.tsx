import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { DownloadButton, type DownloadStatus } from "@/components/DownloadButton";
import { Settings } from "lucide-react";

type TracksDownloadFooterProps = {
  downloadStatus?: DownloadStatus;
  onDownloadClick?: () => void;
};

export default function TracksDownloadFooter({
  downloadStatus,
  onDownloadClick,
}: TracksDownloadFooterProps) {
  return (
    <CardFooter className="sticky bottom-0 z-10 gap-1 border-t pb-4  bg-card ">
      <Button variant="secondary" size="icon-lg">
        <Settings />
      </Button>
      <DownloadButton status={downloadStatus} onClick={onDownloadClick} className="flex-1" />
    </CardFooter>
  );
}
