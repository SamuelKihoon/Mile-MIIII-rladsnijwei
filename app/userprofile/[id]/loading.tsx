import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function Loading() {
  return (
    <div className="flex h-screen">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex flex-col w-48 border-r bg-white">
        <div className="p-4 rounded-lg">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="p-4 space-y-2">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header skeleton */}
        <header className="flex items-center justify-between p-4 bg-gray-50">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md md:hidden" />
            <Skeleton className="h-9 w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </header>

        {/* Profile content skeleton */}
        <div className="flex-1 overflow-auto p-2">
          <div className="w-full mx-auto">
            {/* Back button skeleton */}
            <div className="mt-4 mb-2">
              <Skeleton className="h-8 w-24" />
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3 space-y-6">
                {/* Profile header skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <Skeleton className="h-32 w-full" />
                  <div className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-8 w-48 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-20" />
                      <Skeleton className="h-9 w-20" />
                    </div>
                  </div>
                </div>

                {/* Bio skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <Skeleton className="h-7 w-32 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Prompts skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <Skeleton className="h-7 w-48 mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="aspect-[16/10] rounded-xl" />
                      ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Stats skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <Skeleton className="h-7 w-24 mb-4" />
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>

                {/* Interests skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <Skeleton className="h-7 w-24 mb-4" />
                  <div className="flex flex-wrap gap-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-6 w-16 rounded-full" />
                      ))}
                  </div>
                </div>

                {/* Ad skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <Skeleton className="aspect-[1/1] w-full" />
                  <div className="p-4">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-3" />
                    <Skeleton className="h-9 w-full" />
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
