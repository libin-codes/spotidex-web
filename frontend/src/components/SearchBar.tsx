import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { ClipboardPaste, CircleX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SearchBar() {
  const [searchInput, setSearchInput] = useState("");
  return (
    <ButtonGroup className="w-full">
      <Input
        id="input-button-group"
        placeholder="Search or paste spotify link"
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.currentTarget.value);
        }}
      />

      {searchInput ? (
        <Button
          variant={"destructive"}
          onClick={() => {
            setSearchInput("");
          }}
        >
          <CircleX />
          Clear
        </Button>
      ) : (
        <Button
          onClick={async () => {
            const clipboard = await navigator.clipboard.readText();
            const isSpotifyLink =
              clipboard.includes("open.spotify.com") &&
              ["track", "playlist", "album"].some((type) =>
                clipboard.includes(type),
              );

            if (isSpotifyLink) {
              setSearchInput(clipboard);
            } else {
              toast.info("Invalid Spotify link", { position: "top-center" });
            }
          }}
        >
          <ClipboardPaste />
          Paste
        </Button>
      )}
    </ButtonGroup>
  );
}
