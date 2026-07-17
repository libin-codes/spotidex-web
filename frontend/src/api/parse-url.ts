export type SpotifyContentType = "track" | "playlist" | "album";

export type ParsedSpotifyUrl = {
  type: SpotifyContentType;
  id: string;
};

const URL_REGEX =
  /open\.spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/;
const URI_REGEX = /spotify:(track|playlist|album):([a-zA-Z0-9]+)/;

export function parseSpotifyUrl(input: string): ParsedSpotifyUrl | null {
  const urlMatch = input.match(URL_REGEX);
  if (urlMatch) {
    return { type: urlMatch[1] as SpotifyContentType, id: urlMatch[2] };
  }

  const uriMatch = input.match(URI_REGEX);
  if (uriMatch) {
    return { type: uriMatch[1] as SpotifyContentType, id: uriMatch[2] };
  }

  return null;
}
