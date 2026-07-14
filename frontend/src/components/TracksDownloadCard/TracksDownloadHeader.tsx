import { CardHeader, CardTitle, CardDescription } from "../ui/card";

type tracksDownloadHeaderProps = {
  cover_url: string;
  title: string;
  subtitle: string;
};

export default function TracksDownloadHeader({
  cover_url,
  title,
  subtitle,
}: tracksDownloadHeaderProps) {
  return (
    <CardHeader className="sticky top-0 z-10 flex gap-3 ">
      <img
        src={cover_url}
        alt={`${title} cover`}
        className="size-12 shrink-0 rounded-2xl object-cover"
      />

      <div className="">
        <CardTitle className="truncate">{title}</CardTitle>
        <CardDescription className="truncate">{subtitle}</CardDescription>
      
      </div>
    </CardHeader>
  );
}
