import Skeleton from "@/components/Skeleton/Skeleton";

export const ModuleLoadingDetail = () => {
  return (
    <div className="pb-10">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 mb-6">
        <div className="flex items-center gap-4 justify-between">
          <Skeleton height="28px" width="160px" className="rounded" />
          <div className="flex gap-4">
            <Skeleton height="36px" width="70px" className="rounded" />
            <Skeleton height="36px" width="90px" className="rounded" />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-12 gap-4 px-4">
        {/* Left Column */}
        <div className="col-span-9 space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg border p-4">
              <Skeleton height="20px" width="120px" className="rounded mb-3" />
              <Skeleton height="40px" className="rounded" />
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="col-span-3 space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg border p-4">
              <Skeleton height="18px" width="100px" className="rounded mb-3" />
              <Skeleton height="36px" className="rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Loading component
export const ModuleLoadingTable = ({ fieldsCount = 5 }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Skeleton height="32px" width="200px" className="rounded-md" />
            </div>
            <div className="ml-auto">
              <Skeleton height="40px" width="120px" className="rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Table Header Skeleton */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60">
                <div className="flex items-center min-w-[800px]">
                  <div className="w-12 flex items-center justify-center py-4">
                    <Skeleton height="16px" width="16px" className="rounded" />
                  </div>
                  {Array.from({ length: fieldsCount }).map((_, index) => (
                    <div
                      key={index}
                      className="flex-1 py-4 px-4 flex items-center min-w-0"
                    >
                      <Skeleton
                        height="20px"
                        width="80px"
                        className="rounded-md"
                      />
                    </div>
                  ))}
                  <div className="w-32 py-4 px-4 text-center">
                    <Skeleton
                      height="20px"
                      width="60px"
                      className="rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Table Body Skeleton */}
              <div className="divide-y divide-slate-100">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center min-w-[800px] hover:bg-slate-50/50 transition-colors duration-200"
                  >
                    <div className="w-12 flex items-center justify-center py-4">
                      <Skeleton
                        height="16px"
                        width="16px"
                        className="rounded"
                      />
                    </div>
                    {Array.from({ length: fieldsCount }).map(
                      (_, fieldIndex) => (
                        <div
                          key={fieldIndex}
                          className="flex-1 py-4 px-4 flex items-center min-w-0"
                        >
                          <Skeleton height="20px" className="rounded-md" />
                        </div>
                      )
                    )}
                    <div className="w-32 py-4 px-4 flex items-center justify-center gap-2">
                      <Skeleton
                        height="20px"
                        width="60px"
                        className="rounded-md"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};