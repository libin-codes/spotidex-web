import { CardHeader, CardTitle } from "../ui/card";
import { TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";

type SearchResultsHeaderProps = {
  totalCount: number;
  tracksCount: number;
  playlistsCount: number;
  albumsCount: number;
};

export function SearchResultsHeader({
  totalCount,
  tracksCount,
  playlistsCount,
  albumsCount,
}: SearchResultsHeaderProps) {
  return (
    <CardHeader className="sticky top-0 z-10 flex flex-col p-0 pt-4 w-full">
      <div className="px-4 pb-2 flex w-full items-center justify-between">
        <div className="flex gap-2 items-center justify-center">
  
            
            <CardTitle>Search Results</CardTitle>
         
        </div>
        <Badge variant="secondary" className="text-xs">
          {totalCount} {totalCount === 1 ? "result" : "results"}
        </Badge>
      </div>
      <div className="w-full">
        <TabsList className="w-full p-0 border-b-3 pb-px " variant={"line"}>
          <TabsTrigger value="tracks">{tracksCount} Tracks</TabsTrigger>
          <TabsTrigger value="playlists">
            {playlistsCount} Playlists
          </TabsTrigger>
          <TabsTrigger value="albums">{albumsCount} Albums</TabsTrigger>
        </TabsList>
      </div>
    </CardHeader>
  );
}
