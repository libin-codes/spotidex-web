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

  function parseSpotifyURL(input: string): SpotifyResource | null {
    const trimmed = input.trim();
    if (!trimmed) return null;

    const uriMatch = trimmed.match(
      /^spotify:(track|playlist|album):([A-Za-z0-9]+)/i
    );
    if (uriMatch) {
      return {
        type: uriMatch[1].toLowerCase() as "track" | "playlist" | "album",
        id: uriMatch[2],
      };
    }

    let urlString = trimmed;
    if (/^open\.spotify\.com/i.test(urlString)) {
      urlString = `https://${urlString}`;
    }

    try {
      const url = new URL(urlString);
      if (
        url.hostname !== "open.spotify.com" &&
        !url.hostname.endsWith(".spotify.com")
      ) {
        return null;
      }

      const match = url.pathname.match(
        /\/(track|playlist|album)\/([A-Za-z0-9]+)/i
      );
      if (match) {
        return {
          type: match[1].toLowerCase() as "track" | "playlist" | "album",
          id: match[2],
        };
      }
    } catch {
      return null;
    }

    return null;
  }

  function handlePastedText(text: string) {
    const resource = parseSpotifyURL(text);
    if (resource) {
      onPaste(resource);
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
      const trimmed = searchInput.trim();
      if (!trimmed) return;

      const resource = parseSpotifyURL(trimmed);
      if (resource) {
        onPaste(resource);
      } else {
        onSearch(trimmed);
      }
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
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading && !disabled && !isDownloading) {
              e.preventDefault();
              handleButtonClick();
            }
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