"use client";
const MobileSidebarButton = () => {
  return (
    <button
      className="lg:hidden fixed bottom-6 left-6 z-40 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
      onClick={() => {
        const overlay = document.getElementById("mobile-sidebar-overlay");
        const sidebar = document.getElementById("mobile-sidebar");
        overlay?.classList.toggle("hidden");
        sidebar?.classList.toggle("translate-x-[-100%]");
      }}
      aria-label="Toggle sidebar"
    >
      <svg
        className="w-6 h-6 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
};

export default MobileSidebarButton;
