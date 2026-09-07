import {useState } from "react";
import {Loader, Search, X } from "lucide-react";
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

  function handleButtonClick() {
    if (hasResults) {
      setSearchInput("");
      onClear();
    } else {
      onSearch(searchInput.trim());
    }
  }

  return (
    <Field className="pb-3 px-3">
      <InputGroup  className="h-14 rounded-full">
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
            if (text)  handlePastedText(text);
          }}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="sm"
            className="w-24"
            variant={
              isLoading
                ? "secondary"
                : searchInput === ""
                  ? "default"
                  : hasResults
                    ? "destructive"
                    : "default"
            }
            disabled={isLoading || searchInput===""}
            onClick={()=>{
              handleButtonClick()
           
            }}
          >
       
            {isLoading && (
              <>
                <Loader className="animate-spin" />
                Loading
              </>
            )}
            {searchInput !== "" && hasResults && !isLoading && (
              <>
                <X />
                Clear
              </>
            )}
            {!hasResults && !isLoading && (
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