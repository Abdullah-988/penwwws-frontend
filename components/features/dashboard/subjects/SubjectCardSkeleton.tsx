import { Skeleton } from "@/components/ui/skeleton";

export function SubjectCardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border">
      <div className="flex h-full w-full flex-col items-start">
        {/* Image Skeleton */}
        <Skeleton className="h-[150px] w-full rounded-none" />

        {/* Subject Name Skeleton */}
        <Skeleton className="mx-2 mt-3 h-6 w-[60%] rounded-lg" />

        {/* Teachers Avatars Skeleton */}
        <div className="flex items-center p-2">
          {[...Array(5).keys()].map((key, index) => (
            <div
              key={key}
              className="border-background relative size-8 rounded-full border-2 bg-white"
              style={{
                zIndex: 5 - index,
                right: index * 10,
              }}
            >
              <Skeleton className="size-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
