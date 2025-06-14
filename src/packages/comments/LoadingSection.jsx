import Skeleton from "@/components/Skeleton/Skeleton";

// Component loading chung
export const LoadingSection = ({ showVerticalLine = false }) => (
  <div className="flex gap-4 relative group transition-all duration-300 ease-out hover:transform">
    {/* Avatar với hiệu ứng 3D - giống hệt gốc */}
    <div className="relative flex-shrink-0">
      <div className="relative w-12 h-12 rounded-full ring-4 shadow-lg z-20 transition-all duration-300 ease-out ring-gray-100 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/20 before:to-transparent before:z-10 before:pointer-events-none">
        <Skeleton
          variant="circle"
          width="100%"
          height="100%"
          style={{ borderRadius: "50%" }}
        />
        {/* Online indicator */}
        <div className="absolute -bottom-1 z-10 -right-1 w-4 h-4 bg-gray-200 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
      </div>

      {/* Vertical line với gradient - giống hệt gốc */}
      {showVerticalLine && (
        <div className="w-0.5 bg-gradient-to-b from-blue-400 via-purple-300 to-green-200 h-[calc(100%-48px)] absolute top-14 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out">
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-full"></div>
        </div>
      )}
    </div>

    {/* Comment content với glassmorphism - giống hệt gốc */}
    <div className="flex-1 min-w-0">
      <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-3 shadow-sm transition-all duration-300 ease-out hover:shadow-xl hover:bg-white/90 hover:border-white/40 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
        {/* Header with user info - giống hệt gốc */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {/* Username loading */}
            <div className="font-semibold text-gray-800 text-lg">
              <Skeleton width="100px" height="20px" />
            </div>

            {/* Rating badge loading - giống hệt gốc */}
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-full border border-amber-100">
              <Skeleton width="14px" height="14px" />
              <div className="text-xs font-medium text-amber-700">
                <Skeleton width="25px" height="12px" />
              </div>
            </div>

            {/* Time loading - giống hệt gốc */}
            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              <Skeleton width="50px" height="12px" />
            </div>
          </div>
        </div>

        {/* Comment content loading - giống hệt gốc */}
        <div className="text-gray-700 leading-relaxed mb-3">
          <div className="space-y-2">
            <Skeleton width="100%" height="16px" />
            <Skeleton width="90%" height="16px" />
            <Skeleton width="75%" height="16px" />
          </div>
        </div>

        {/* Actions bar loading - giống hệt gốc */}
        <div className="flex items-center gap-4 transition-all duration-300 opacity-70">
          {/* Reaction button loading */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200">
            <Skeleton width="16px" height="16px" />
            <Skeleton width="30px" height="14px" />
          </div>

          {/* Reply button loading - giống hệt gốc */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-200 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <Skeleton width="16px" height="16px" />
            <div>
              <Skeleton width="50px" height="14px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);