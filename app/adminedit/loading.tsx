import { Skeleton } from "@/components/ui/skeleton"

export default function AdminEditLoading() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-10 w-64 mb-6" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </div>

        <div className="md:col-span-2">
          <Skeleton className="h-16 w-full mb-4 rounded-lg" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
