import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { Input } from "./ui/input";
import { useState } from "react";
import { Clipboard, Loader, Search, X } from "lucide-react";
import { toast } from "sonner";
import type { SpotifyResource } from "./types";

type SearchBarProps = {
  onPaste?: (resource: SpotifyResource) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  state: "idle" | "loading" | "locked";
};

export function SearchBar({
  onPaste,
  onSearch,
  onClear,
  state,
}: SearchBarProps) {
  const [searchInput, setSearchInput] = useState("");

  const variants = {
    idle: "default",
    loading: "secondary",
    locked: "destructive",
  } as const;

  function isValidSpotifyURL(url: string): boolean {
    return (
      url.includes("open.spotify.com") &&
      (url.includes("/track/") ||
        url.includes("/playlist/") ||
        url.includes("/album/"))
    );
  }

  function getSpotifyResource(url: string): SpotifyResource {
    const { pathname } = new URL(url);

    const match = pathname.match(/^\/(track|playlist|album)\/([A-Za-z0-9]+)/);

    if (match) {
      return {
        type: match[1] as SpotifyResource["type"],
        id: match[2],
      };
    }
    throw new Error("Invalid Spotify URL");
  }

  async function handleButtonClick() {
    switch (state) {
      case "idle":
        if (searchInput === "") {
          const url = await navigator.clipboard.readText();
          if (isValidSpotifyURL(url)) {
            onPaste?.(getSpotifyResource(url));
            setSearchInput(url);
          } else {
            toast("Invalid Spotify URL",{"position":"top-center"});
          }
        } else {
          onSearch?.(searchInput);
        }
        break;
      case "locked":
        onClear?.();
        setSearchInput("");
        break;
    }
  }

  return (
    <Field orientation={"horizontal"} className="gap-2 border-t px-2 py-3">
    
      <Input
        type="search"
        placeholder="Search or Paste"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        disabled={state != "idle"}
      />

      <Button
        size={"lg"}
        className={"w-26"}
        variant={variants[state]}
        disabled={state === "loading"}
        onClick={handleButtonClick}
      >
        {state === "idle" && searchInput === "" && (
          <>
            <Clipboard />
            Paste
          </>
        )}

        {state === "idle" && searchInput !== "" && (
          <>
            <Search />
            Search
          </>
        )}

        {state === "loading" && (
          <>
            <Loader className="animate-spin" />
            Loading
          </>
        )}

        {state === "locked" && (
          <>
            <X />
            Clear
          </>
        )}
      </Button>
    </Field>
  );
}
