import { CardDescription, CardHeader, CardTitle } from "../ui/card";
import { TabsList, TabsTrigger } from "../ui/tabs";

type SearchResultsHeaderProps = {
  query: string;
};

export function SearchResultsHeader({ query }: SearchResultsHeaderProps) {
  return (
    <CardHeader className="sticky top-0 z-10 flex flex-col gap-4 p-0 pt-4 pb-2 w-full">
      <div className="px-4 flex gap-4">
        <div className="w-full">
          <CardTitle className="truncate flex justify-between w-full items-center">
            {"Search Results"}
          </CardTitle>
          <CardDescription className="truncate">{`search results for query "${query}"`}</CardDescription>
        </div>
      </div>
      <div className="px-2 w-full border-y py-4">
        <TabsList className="w-full">
          <TabsTrigger value="tracks">Tracks</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
        </TabsList>
      </div>
    </CardHeader>
  );
}
