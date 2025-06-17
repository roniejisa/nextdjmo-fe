"use client"

import LinkCustom from "@/packages/translation/Link";

const GroupButtonForm = ({ module, isPending, title }) => {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Title Section */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {title?.toUpperCase() || ''}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 ml-4">
          <SaveButton isPending={isPending} />
          <CancelButton module={module} />
        </div>
      </div>
    </header>
  );
};

// Separate Save Button Component
const SaveButton = ({ isPending }) => {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={`
        inline-flex items-center justify-center
        px-6 py-2.5 rounded-lg
        text-sm font-medium text-white
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${
          isPending
            ? 'bg-gray-400 cursor-not-allowed opacity-50'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }
      `}
    >
      {isPending ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Đang lưu...
        </>
      ) : (
        'Lưu'
      )}
    </button>
  );
};

// Separate Cancel Button Component
const CancelButton = ({ module }) => {
  return (
    <LinkCustom
      href={`${process.env.NEXT_PUBLIC_ADMIN_URL}${module}`}
      className={`
        inline-flex items-center justify-center
        px-6 py-2.5 rounded-lg
        text-sm font-medium text-white
        bg-red-600 hover:bg-red-700 active:bg-red-800
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
      `}
    >
      Hủy
    </LinkCustom>
  );
};

export default GroupButtonForm;