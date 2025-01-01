import LinkCustom from "@/packages/translation/Link";

const Pagination = ({ total, limit, page, module, items, searchParams }) => {
  const totalPages = Math.ceil(total / limit);
  const startResult = limit * (page - 1) + 1;
  const endResult = limit * (page - 1) + items.length;
  const createSearchParamString = (page) => {
    const obj = {
      ...searchParams,
      limit,
      page
    }

    return new URLSearchParams(obj).toString();
  } 
  return (
    <div className="flex items-center justify-between mt-4 flex-wrap">
      <div className="flex gap-2 items-center">
        <LinkCustom
          className={`[&[disabled]]:opacity-50 [&[disabled]]:cursor-not-allowed [&[disabled]]:pointer-events-none hover:bg-gray-300 transition px-3 py-2 rounded-md`}
          disabled={page <= 1}
          href={
            process.env.NEXT_PUBLIC_ADMIN_URL +
            `${module}?${createSearchParamString(page - 1)}`
          }
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 20 20"
            aria-hidden="true"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </LinkCustom>
        {Array.from({ length: totalPages }).map((_, index) => {
          if (
            [1, 2, 3].includes(index + 1) ||
            [totalPages - 2, totalPages - 1, totalPages].includes(index + 1) ||
            index + 1 == page ||
            index + 1 == page - 1 ||
            index + 1 == page + 1
          ) {
            return (
              <LinkCustom
                className={`mx-1 transition hover:bg-gray-300 px-3 py-2 rounded-lg ${
                  index + 1 == page ? "text-outline pointer-events-none" : ""
                }`}
                key={index}
                href={
                  process.env.NEXT_PUBLIC_ADMIN_URL +
                  `${module}?${createSearchParamString(index + 1)}`
                }
              >
                {index + 1}
              </LinkCustom>
            );
          } else if (
            index + 1 == 4 ||
            (index + 1 == totalPages - 3 && totalPages > 6)
          ) {
            return <span key={index}>...</span>;
          }
          return null;
        })}

        <LinkCustom
          href={
            process.env.NEXT_PUBLIC_ADMIN_URL +
            `${module}?${createSearchParamString(page + 1)}`
          }
          className={`[&[disabled]]:opacity-50 [&[disabled]]:cursor-not-allowed [&[disabled]]:pointer-events-none hover:bg-gray-300 transition px-3 py-2 rounded-md`}
          disabled={totalPages == page}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 20 20"
            aria-hidden="true"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </LinkCustom>
      </div>
      <div className="flex items-center">
        Kết quả{" "}
        {startResult < endResult
          ? `${startResult} - ${endResult} `
          : `${startResult} `}
        trong tổng số {total} kết quả
        <div className="flex items-center">
          <select className="ml-2 h-[35px] w-[100px] mr-2" defaultValue={page}>
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
