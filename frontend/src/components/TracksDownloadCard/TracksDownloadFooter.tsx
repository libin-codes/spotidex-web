import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";

export default function TracksDownloadFooter() {
  return (
    <CardFooter className="sticky bottom-0 z-10 gap-1">
      <Button variant="secondary" size="icon-lg">
        <Settings />
      </Button>
      <Button className="flex-1" size="lg" onClick={() => {}}>
        Download
      </Button>
    </CardFooter>
  );
}
