import { Skeleton } from "@/components/ui/skeleton";

export function SubjectCardSkeleton() {
  return (
    <div className="border-border flex items-center justify-between rounded-xl border p-4">
      <div className="flex h-full w-full flex-col items-start justify-between gap-3">
        {/* Subject Name Skeleton */}
        <Skeleton className="h-6 w-[60%] rounded-lg" />

        {/* Teachers Avatars Skeleton */}
        <div className="flex items-center">
          {[...Array(5)].keys().map((key) => (
            <div
              key={key}
              className="border-background relative size-8 rounded-full border-2"
              style={{
                zIndex: 5 - key,
                right: key * 10,
              }}
            >
              <Skeleton className="size-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Image Skeleton */}
      <div className="relative size-24 overflow-hidden rounded-xl">
        <Skeleton className="size-full rounded-xl" />
      </div>
    </div>
  );
}
