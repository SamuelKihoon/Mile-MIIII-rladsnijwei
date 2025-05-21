import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex md:flex-col md:w-48 border-r bg-white">
        <div className="p-4">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="flex-1 p-4 space-y-3">
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header skeleton */}
        <div className="flex items-center justify-between p-4 border-b">
          <Skeleton className="h-10 w-48" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        {/* Settings content skeleton */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-10 w-32 mb-6" />

            <div className="space-y-6">
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <Skeleton className="h-8 w-48 mb-6" />
                      <div className="space-y-6">
                        {Array(3)
                          .fill(null)
                          .map((_, j) => (
                            <div key={j} className="space-y-2">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-10 w-full" />
                            </div>
                          ))}
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
