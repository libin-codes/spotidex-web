import { useRef, useState } from "react";
import { Clipboard, Loader, X } from "lucide-react";
import { toast } from "sonner";
import { Field } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { SearchSuggestions } from "./SearchSuggestions";
import { useTrackSearch } from "@/hooks/use-track-search";
import { useDebounce } from "@/hooks/use-debounce";
import type { TrackModel } from "@/api/types";
import type { SpotifyResource } from "../types";

type SearchBarProps = {
  onPaste: (resource: SpotifyResource) => void;
  onSelect: (track: TrackModel) => void;
  onClear: () => void;
  isLoading: boolean;
  disabled: boolean;
};

export function SearchBar({
  onPaste,
  onSelect,
  onClear,
  isLoading,
  disabled,
}: SearchBarProps) {
  const [searchInput, setSearchInput] = useState("");
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const isSpotifyUrl = isValidSpotifyURL(searchInput);
  const debouncedQuery = useDebounce(isSpotifyUrl ? "" : searchInput, 300);
  const { data: tracks = [], isFetching } = useTrackSearch(debouncedQuery);
  const hasActiveSearch = debouncedQuery.trim().length > 0;

  const busy = isLoading || isFetching;

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
    if (searchInput === "") {
      const url = await navigator.clipboard.readText();
      if (isValidSpotifyURL(url)) {
        onPaste(getSpotifyResource(url));
        setSearchInput(url);
      } else {
        toast("Invalid Spotify URL", { position: "top-center" });
      }
    } else {
      setSearchInput("");
      onClear();
    }
  }

  return (
    <Field className="pb-3 px-3">
      <InputGroup ref={anchorRef} className="h-14 rounded-full">
        <InputGroupInput
          className="pl-5 text-md disabled:opacity-80"
          type="search"
          placeholder="Search or Paste to Begin"
          value={searchInput}
          disabled={isLoading || disabled}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => searchInput !== "" && setOpen(true)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="sm"
            className="w-24"
            variant={
              busy
                ? "secondary"
                : searchInput === ""
                  ? "default"
                  : "destructive"
            }
            disabled={busy}
            onClick={handleButtonClick}
          >
            {searchInput === "" && !busy && (
              <>
                <Clipboard />
                Paste
              </>
            )}
            {busy && (
              <>
                <Loader className="animate-spin" />
                Loading
              </>
            )}
            {searchInput !== "" && !busy && (
              <>
                <X />
                Clear
              </>
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <SearchSuggestions
        open={open && searchInput !== "" && hasActiveSearch && !isSpotifyUrl}
        onOpenChange={setOpen}
        anchor={anchorRef}
        tracks={tracks}
        isFetching={isFetching}
        onSelect={onSelect}
      />
    </Field>
  );
}