import LinkCustom from "@/packages/translation/Link";

const Pagination = ({ total, limit, page, module, items }) => {
  const totalPages = Math.ceil(total / limit);
  const startResult = limit * (page - 1) + 1;
  const endResult = limit * (page - 1) + items.length;
  return (
    <div className="flex items-center justify-between mt-4 flex-wrap">
      <div className="flex items-center">
        <div className="flex items-center">
          Trang
          <select className="ml-2 h-[35px] w-10 mr-2" defaultValue={page}>
            {Array.from({ length: totalPages }).map((_, index) => (
              <option key={index + 1} value={index + 1}>{index + 1}</option>
            ))}
          </select>
        </div>
        <span className="inline-block mr-4"></span>
        Kết quả {startResult < endResult ? `${startResult} - ${endResult} ` : `${startResult} `}
        trong tổng số {total} kết quả
      </div>
      <div className="py-2">
        {page > 1 && (
          <LinkCustom
            className="border px-3 py-2 rounded-md"
            href={process.env.NEXT_PUBLIC_ADMIN_URL+`${module}?limit=${limit}&page=${page - 1}`}
          >
            Prev
          </LinkCustom>
        )}
        {Array.from({ length: totalPages }).map((_, index) => {
          if (
            [1, 2, 3].includes(index + 1) ||
            [totalPages - 2, totalPages - 1, totalPages].includes(index + 1) ||
            index + 1 === page ||
            index + 1 === page - 1 ||
            index + 1 === page + 1
          ) {
            return (
              <LinkCustom
                className={`mx-1 border px-3 py-2 rounded-lg ${
                  index + 1 === page
                    ? "bg-red-500 border-red-500 text-white pointer-events-none"
                    : ""
                }`}
                key={index}
                href={process.env.NEXT_PUBLIC_ADMIN_URL+`${module}?limit=${limit}&page=${index + 1}`}
              >
                {index + 1}
              </LinkCustom>
            );
          } else if (
            index + 1 === 4 ||
            (index + 1 === totalPages - 3 && totalPages > 6)
          ) {
            return <span key={index}>...</span>;
          }
          return null;
        })}
        {page + 1 <= totalPages && (
          <LinkCustom
            href={process.env.NEXT_PUBLIC_ADMIN_URL+`${module}?limit=${limit}&page=${page + 1}`}
            className="border px-3 py-2 rounded-lg"
          >
            {" "}
            Next
          </LinkCustom>
        )}
      </div>
    </div>
  );
};

export default Pagination;
