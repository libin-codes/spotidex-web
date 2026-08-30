import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PlaylistCardSkeleton() {
  return (
    <Card className="w-full h-full min-h-0 no-scrollbar p-0 gap-0" size="sm">
      <CardHeader className="sticky top-0 z-10 flex flex-col gap-4 p-0 pt-4 bg-card w-full">
        <div className="px-4 flex gap-4">
          <Skeleton className="size-12 shrink-0 rounded-2xl" />
          <div className="w-full space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-y bg-card w-full">
          <div className="flex items-center gap-4">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 h-full p-0 min-h-0">
        <div className="space-y-2 p-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 rounded-xl px-3 py-2">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="sticky bottom-0 z-10 gap-1 border-t bg-card pb-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 flex-1 rounded-full" />
      </CardFooter>
    </Card>
  );
}
