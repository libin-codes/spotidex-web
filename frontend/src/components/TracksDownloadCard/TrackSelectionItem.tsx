import { Checkbox } from "@/components/ui/checkbox";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

type TrackItemProps = {
  cover_url: string;
  title: string;
  artists: string[];
  isSelected:boolean;
  onSelectChange?: (isSelected: boolean) => void;
};

export default function TrackItem({
  cover_url,
  title,
  artists,
  isSelected,
  onSelectChange,
}: TrackItemProps) {


  return (
    <Item
      variant="outline"
      className={`cursor-pointer border-0 p-3 px-0  rounded-none `}
      onClick={() => {
        onSelectChange?.(!isSelected);
       
      }}
    >
      <ItemMedia variant="image">
        <img src={cover_url} alt={"Cover Art"} />
      </ItemMedia>
      <ItemContent className="gap-0">
        <ItemTitle className="line-clamp-1">{title}</ItemTitle>
        <ItemDescription className="line-clamp-1">
          {artists.toString()}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="pointer-events-none">
        <Checkbox checked={isSelected} />
      </ItemActions>
    </Item>
  );
}
