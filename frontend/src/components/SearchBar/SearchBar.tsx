import { useState } from "react";
import { ArrowLeft, Loader, Search, X } from "lucide-react";
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
  canGoBack?: boolean;
  onBack?: () => void;
  activeQuery?: string;
  hasResults: boolean;
  isLoading: boolean;
  isDownloading?: boolean;
  disabled: boolean;
};

export function SearchBar({
  onPaste,
  onSearch,
  onClear,
  canGoBack = false,
  onBack,
  activeQuery,
  hasResults,
  isLoading,
  isDownloading = false,
  disabled,
}: SearchBarProps) {
  const [prevActiveQuery, setPrevActiveQuery] = useState(activeQuery);
  const [prevHasResults, setPrevHasResults] = useState(hasResults);
  const [searchInput, setSearchInput] = useState(activeQuery ?? "");

  // Sync input when activeQuery or hasResults changes externally
  if (activeQuery !== prevActiveQuery || hasResults !== prevHasResults) {
    setPrevActiveQuery(activeQuery);
    setPrevHasResults(hasResults);
    if (activeQuery !== undefined) {
      setSearchInput(activeQuery);
    } else if (!hasResults) {
      setSearchInput("");
    }
  }

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
    }
  }

  function handleClearClick() {
    setSearchInput("");
    onClear();
  }

  function handleButtonClick() {
    if (canGoBack) {
      onBack?.();
    } else if (hasResults) {
      handleClearClick();
    } else {
      onSearch(searchInput.trim());
    }
  }

  return (
    <Field className="pb-3 px-3">
      <InputGroup className="h-14 rounded-full border-accent border-2">
        <InputGroupInput
          className="pl-5 text-md disabled:opacity-80"
          type="search"
          placeholder="Search or Paste to Begin"
          value={searchInput}
          disabled={isLoading || disabled || isDownloading}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (text) handlePastedText(text);
          }}
        />
        <InputGroupAddon align="inline-end" className="">
          {canGoBack && !isLoading && (
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              title="Clear search"
              onClick={handleClearClick}
              disabled={isDownloading}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" />
            </InputGroupButton>
          )}

          <InputGroupButton
            size="sm"
            className="w-24"
            variant={
              isLoading
                ? "secondary"
                : canGoBack
                  ? "secondary"
                  : searchInput === ""
                    ? "default"
                    : hasResults
                      ? "destructive"
                      : "default"
            }
            disabled={
              isLoading ||
              isDownloading ||
              (!hasResults && !canGoBack && searchInput === "")
            }
            onClick={handleButtonClick}
          >
            {isLoading && (
              <>
                <Loader className="animate-spin" />
                Loading
              </>
            )}
            {!isLoading && canGoBack && (
              <>
                <ArrowLeft />
                Back
              </>
            )}
            {!isLoading && !canGoBack && hasResults && (
              <>
                <X />
                Clear
              </>
            )}
            {!isLoading && !canGoBack && !hasResults && (
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