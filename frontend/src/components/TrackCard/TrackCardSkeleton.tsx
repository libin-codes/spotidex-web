import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TrackCardSkeleton() {
  return (
    <Card className="max-w-sm p-4" size="sm">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-14 rounded-full" />
        </div>
        <Skeleton className="aspect-square w-full rounded-2xl" />
      </CardContent>

      <div className="flex flex-col gap-4">
        <CardHeader className="gap-2 px-0 pl-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>

        <CardFooter className="gap-1 px-0">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 flex-1 rounded-full" />
        </CardFooter>
      </div>
    </Card>
  );
}
