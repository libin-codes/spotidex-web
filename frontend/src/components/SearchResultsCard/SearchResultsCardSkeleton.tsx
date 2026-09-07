import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchResultsCardSkeleton() {
  return (
    <Card className="w-full h-full min-h-0 no-scrollbar p-0 gap-0" size="sm">
      <CardHeader className="sticky top-0 z-10 flex flex-col gap-4 p-0 py-4 w-full border-b">
        <div className="px-4 flex gap-4">
          <div className="w-full space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
