import type { AlbumSearchResult } from "@/api/types";
import type { SpotifyResource } from "@/components/types";
import { AlbumResultItem } from "../items/AlbumResultItem";
import { EmptyResult } from "../EmptyResult";

type AlbumsPanelProps = {
  albums: AlbumSearchResult[];
  onSelect: (resource: SpotifyResource) => void;
};

export function AlbumsPanel({ albums, onSelect }: AlbumsPanelProps) {
  return (
    <div
      className="w-full shrink-0 h-full snap-start snap-always"
      role="tabpanel"
      aria-label="Albums"
    >
      <div className="flex flex-col gap-0 h-full overflow-y-auto">
        {albums.map((album) => (
          <AlbumResultItem
            key={album.spotify_id}
            album={album}
            onClick={() => onSelect({ type: "album", id: album.spotify_id })}
          />
        ))}
        {albums.length === 0 && <EmptyResult message="No albums found" />}
      </div>
    </div>
  );
}
