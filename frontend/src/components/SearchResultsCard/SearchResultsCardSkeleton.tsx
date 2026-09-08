import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchResultsCardSkeleton() {
  return (
    <Card className="w-full h-full min-h-0 no-scrollbar p-0 gap-0" size="sm">
      <CardHeader className="sticky top-0 z-10 flex flex-col p-0 pt-4 w-full">
        {/* Top row: Left title + Right badge */}
        <div className="px-4 flex w-full items-center justify-between">
          <div className="flex gap-2 items-center">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-5 w-28 rounded" />
          </div>
          <Skeleton className="h-5 w-18 rounded-3xl" />
        </div>

        {/* Tab triggers line */}
        <div className="w-full border-b-3 pb-px mb-2">
          <div className="flex w-full px-4 py-1.5 items-center justify-around">
            <Skeleton className="h-4 w-18" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-18" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 h-full p-0 min-h-0">
        <div className="flex flex-col gap-0">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-3"
            >
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-3.5 w-2/5" />
              </div>
              <Skeleton className="h-4 w-10 shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
