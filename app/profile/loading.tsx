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

        {/* Profile content skeleton */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <div className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-shrink-0 -mt-12 md:-mt-16">
                  <Skeleton className="h-24 w-24 rounded-full" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-4">
                    {Array(3)
                      .fill(null)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <Skeleton className="h-6 w-24 mb-4" />
                  <div className="space-y-4">
                    {Array(3)
                      .fill(null)
                      .map((_, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-8" />
                          </div>
                          <Skeleton className="h-px w-full" />
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="flex flex-wrap gap-2">
                    {Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-6 w-16 rounded-full" />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
