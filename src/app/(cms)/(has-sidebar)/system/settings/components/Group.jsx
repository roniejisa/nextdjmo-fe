import LinkCustom from "@/packages/translation/Link";

// Edit Icon Component
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-colors duration-200"
  >
    <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
    <path d="M13.5 6.5l4 4" />
    <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M19.001 15.5v1.5" />
    <path d="M19.001 21v1.5" />
    <path d="M22.032 17.25l-1.299 .75" />
    <path d="M17.27 20l-1.3 .75" />
    <path d="M15.97 17.25l1.3 .75" />
    <path d="M20.733 20l1.3 .75" />
  </svg>
);

// Field Label Component
const FieldLabel = ({ label, item }) => (
  <div className="relative bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-200 group">
    {/* Main Label */}
    <div className="pr-8">
      <label className="block text-sm font-medium text-gray-700 leading-relaxed">
        {label}
      </label>
      {item?.description && (
        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
      )}
    </div>

    {/* Edit Button */}
    <LinkCustom
      href={`${process.env.NEXT_PUBLIC_ADMIN_URL}settings/${item._id}`}
      className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:shadow-md hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group opacity-0 group-hover:opacity-100 focus:opacity-100"
      title="Chỉnh sửa cấu hình"
      aria-label={`Chỉnh sửa ${label}`}
    >
      <EditIcon />
    </LinkCustom>

    {/* Optional Status Indicator */}
    {item?.status && (
      <div className="absolute top-2 right-2">
        <div
          className={`w-2 h-2 rounded-full ${
            item.status === "active"
              ? "bg-green-400"
              : item.status === "draft"
              ? "bg-yellow-400"
              : "bg-gray-400"
          }`}
          title={`Status: ${item.status}`}
        />
      </div>
    )}
  </div>
);

// Field Content Component
const FieldContent = ({ children }) => (
  <>
    {children}
  </>
);

// Main Group Component
const Group = ({ children, field: { label }, item }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
      {/* Label Section */}
      <div className="lg:col-span-4">
        <FieldLabel label={label} item={item} />
      </div>

      {/* Content Section */}
      <div className="lg:col-span-8">
        <FieldContent>{children}</FieldContent>
      </div>
    </div>
  );
};

// Alternative Compact Layout Component
export const GroupCompact = ({ children, field: { label }, item }) => {
  return (
    <div className="space-y-3">
      {/* Inline Label */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-900">
            {label}
          </label>
          {item?.description && (
            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
          )}
        </div>

        {/* Edit Button */}
        <LinkCustom
          href={`${process.env.NEXT_PUBLIC_ADMIN_URL}settings/${item._id}`}
          className="ml-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          title="Chỉnh sửa cấu hình"
          aria-label={`Chỉnh sửa ${label}`}
        >
          <EditIcon />
        </LinkCustom>
      </div>

      {/* Content */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
        <div className="p-1">{children}</div>
      </div>
    </div>
  );
};

// Alternative Vertical Layout Component
export const GroupVertical = ({ children, field: { label }, item }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
          {item?.description && (
            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
          )}
        </div>

        <LinkCustom
          href={`${process.env.NEXT_PUBLIC_ADMIN_URL}settings/${item._id}`}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200"
          title="Chỉnh sửa cấu hình"
          aria-label={`Chỉnh sửa ${label}`}
        >
          <EditIcon />
        </LinkCustom>
      </div>

      {/* Content */}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Group;
