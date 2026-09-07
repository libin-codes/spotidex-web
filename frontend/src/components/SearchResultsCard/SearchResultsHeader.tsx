import { Search } from "lucide-react";
import { CardHeader, CardTitle } from "../ui/card";
import { TabsList, TabsTrigger } from "../ui/tabs";

export function SearchResultsHeader() {
  return (
    <CardHeader className="sticky top-0 z-10 flex flex-col p-0 pt-4  w-full">
      <div className="px-4 flex w-full">
        <div className="w-full flex gap-2 items-center justify-center">
          <Search size={16} />
          <CardTitle className="">{"Search Results"}</CardTitle>
        </div>
      </div>
      <div className=" w-full ">
        <TabsList className="w-full p-0 border-b-3 pb-px mb-2" variant={"line"}>
          <TabsTrigger value="tracks">Tracks</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
        </TabsList>
      </div>
    </CardHeader>
  );
}
