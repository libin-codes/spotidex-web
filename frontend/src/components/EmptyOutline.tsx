import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { BsSpotify } from "react-icons/bs";


export function EmptyOutline() {
  return (
    <Empty className="border border-dashed h-full ">
      <EmptyHeader className=" text-foreground/90">
        <EmptyMedia variant="icon">
          <BsSpotify />
        </EmptyMedia>
        <EmptyTitle className="font-mono  font-extrabold">
          SPOTIFY DOWNLOADER
        </EmptyTitle>
        <EmptyDescription>
          Search for music or Paste Spotify URL to begin
        </EmptyDescription>
      
      </EmptyHeader>
    </Empty>
  );
}
