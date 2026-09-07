import { useRef, useState } from "react";
import { Clipboard, Loader, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Field } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import type { SpotifyResource } from "../types";

type SearchBarProps = {
  onPaste: (resource: SpotifyResource) => void;
  onSearch: (query: string) => void;
  onClear: () => void;
  hasResults: boolean;
  isLoading: boolean;
  disabled: boolean;
};

export function SearchBar({
  onPaste,
  onSearch,
  onClear,
  hasResults,
  isLoading,
  disabled,
}: SearchBarProps) {
  const [searchInput, setSearchInput] = useState("");
  const anchorRef = useRef<HTMLDivElement>(null);

  const busy = isLoading;

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
        type: match[1] as "track" | "playlist" | "album",
        id: match[2],
      };
    }
    throw new Error("Invalid Spotify URL");
  }

  function handlePastedText(text: string) {
    if (isValidSpotifyURL(text)) {
      onPaste(getSpotifyResource(text));
      setSearchInput(text);
    } else {
      toast("Invalid Spotify URL", { position: "top-center" });
    }
  }

  async function safeReadClipboard(): Promise<string | null> {
    if (!navigator.clipboard) {
      return null;
    }

    if ("permissions" in navigator) {
      try {
        const status = await navigator.permissions.query({
          name: "clipboard-read" as PermissionName,
        });
        if (status.state === "denied") {
          return null;
        }
      } catch {
        // Firefox/Safari don't support clipboard-read query; proceed to read.
      }
    }

    try {
      return await navigator.clipboard.readText();
    } catch {
      return null;
    }
  }

  async function handleButtonClick() {
    if (searchInput === "") {
      const url = await safeReadClipboard();
      if (url) {
        handlePastedText(url);
      } else {
        anchorRef.current?.querySelector("input")?.focus();
        toast("Couldn't read clipboard — long-press the search box and tap Paste.", {
          position: "top-center",
        });
      }
      return;
    }

    if (hasResults) {
      setSearchInput("");
      onClear();
    } else {
      onSearch(searchInput.trim());
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
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (text) handlePastedText(text);
          }}
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
                  : hasResults
                    ? "destructive"
                    : "default"
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
            {searchInput !== "" && hasResults && !busy && (
              <>
                <X />
                Clear
              </>
            )}
            {searchInput !== "" && !hasResults && !busy && (
              <>
                <Search />
                Search
              </>
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}