"use client"
import LinkCustom from "@/packages/translation/Link";
import useRouterCustom from "@/packages/translation/Navigation";
import { usePathname } from "next/navigation";

const Pagination = ({ total, limit, page, module, items, searchParams }) => {
  const totalPages = Math.ceil(total / limit);
  const startResult = limit * (page - 1) + 1;
  const endResult = limit * (page - 1) + items.length;
  const router = useRouterCustom()
  const pathname = usePathname()
  const createSearchParamString = (page) => {
    const obj = {
      ...searchParams,
      limit,
      page,
    };
    return new URLSearchParams(obj).toString();
  };
  const changePage = (page) => {
    const paramString = createSearchParamString(page)
    router.push(pathname + paramString ? "?"+paramString : "")
  }
  return (
    <div className="bg-white px-4 py-6 sm:px-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        {/* Results Info */}
        <div className="flex items-center justify-center lg:justify-start">
          <p className="text-sm text-gray-700 font-medium">
            Kết quả{" "}
            <span className="font-semibold text-gray-900">
              {startResult < endResult
                ? `${startResult} - ${endResult}`
                : `${startResult}`}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-semibold text-gray-900">{total}</span> kết quả
          </p>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center space-x-1">
          {/* Previous Button */}
          <LinkCustom
            className={`
              relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
              transition-all duration-200 ease-in-out
              ${page <= 1 
                ? 'text-gray-400 bg-gray-50 cursor-not-allowed pointer-events-none' 
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 active:bg-gray-100'
              }
            `}
            disabled={page <= 1}
            href={
              process.env.NEXT_PUBLIC_ADMIN_URL +
              `${module}?${createSearchParamString(page - 1)}`
            }
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-1 hidden sm:inline">Trước</span>
          </LinkCustom>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }).map((_, index) => {
              if (
                [1, 2, 3].includes(index + 1) ||
                [totalPages - 2, totalPages - 1, totalPages].includes(index + 1) ||
                (index + 1 >= +page - 2 && index + 1 <= +page + 2)
              ) {
                return (
                  <LinkCustom
                    className={`
                      relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
                      transition-all duration-200 ease-in-out min-w-[40px] justify-center
                      ${index + 1 == page
                        ? 'bg-blue-600 text-white shadow-md pointer-events-none border border-blue-600'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 active:bg-blue-100'
                      }
                    `}
                    key={index}
                    href={
                      process.env.NEXT_PUBLIC_ADMIN_URL +
                      `${module}?${createSearchParamString(index + 1)}`
                    }
                  >
                    {index + 1}
                  </LinkCustom>
                );
              } else if (index + 1 == totalPages - 3 && totalPages > 6) {
                return (
                  <span key={index} className="px-2 py-2 text-gray-500 text-sm font-medium">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          {/* Next Button */}
          <LinkCustom
            href={
              process.env.NEXT_PUBLIC_ADMIN_URL +
              `${module}?${createSearchParamString(page + 1)}`
            }
            className={`
              relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
              transition-all duration-200 ease-in-out
              ${totalPages == page
                ? 'text-gray-400 bg-gray-50 cursor-not-allowed pointer-events-none'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 active:bg-gray-100'
              }
            `}
            disabled={totalPages == page}
          >
            <span className="mr-1 hidden sm:inline">Sau</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </LinkCustom>
        </div>

        {/* Page Selector */}
        <div className="flex items-center justify-center lg:justify-end">
          <label htmlFor="page-select" className="mr-2 text-sm font-medium text-gray-700">
            Trang:
          </label>
          <select 
            id="page-select"
            className="
              border border-gray-300 rounded-lg px-3 py-2 text-sm
              bg-white text-gray-700 font-medium
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              hover:border-gray-400 transition-colors duration-200
              min-w-[100px]
            " 
            defaultValue={page}
            onChange={(e) => changePage(e.target.value)}
          >
            {Array.from({ length: totalPages }).map((_, index) => (
              <option key={index + 1} value={index + 1}>
                Trang {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Pagination;