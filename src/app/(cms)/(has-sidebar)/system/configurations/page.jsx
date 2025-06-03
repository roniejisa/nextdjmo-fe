import ConfigurationComponent from "./Configuration";

export async function generateMetadata() {
  return {
    title: "Cấu hình chung | Admin Panel",
    description: "Quản lý cấu hình ngôn ngữ và thông báo",
  };
}

// Page Header Component
const PageHeader = ({ title, subtitle }) => (
  <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
    <div className="px-4 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm lg:text-base text-gray-600 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  </header>
);

// Main Content Wrapper
const PageContent = ({ children }) => (
  <main className="flex-1 min-h-0">
    <div className="h-full">{children}</div>
  </main>
);

// Main Configuration Page Component
const Configuration = async () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Page Header */}
      <PageHeader
        title="Cấu hình chung"
        subtitle="Quản lý các thiết lập cấu hình chung"
      />

      {/* Main Content */}
      <PageContent>
        <ConfigurationComponent />
      </PageContent>
    </div>
  );
};

// Alternative Minimal Layout
export const ConfigurationMinimal = async () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-4 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Cấu hình chung
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-8 py-6">
        <ConfigurationComponent />
      </div>
    </div>
  );
};

// Alternative Full-width Layout
export const ConfigurationFullWidth = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-10 shadow-lg">
        <div className="px-4 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Cấu hình hệ thống
            </h1>
            <p className="text-blue-100 text-lg">
              Điều chỉnh các thiết lập và tùy chọn toàn cục
            </p>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <ConfigurationComponent />
      </div>
    </div>
  );
};

export default Configuration;
