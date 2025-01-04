"use client";

const TooltipText = ({ label, children, className }) => {
  return (
    <div className="relative group">
      <div
        className={`absolute whitespace-nowrap group-hover:opacity-100 group-hover:visible group-hover:pointer-events-all transition-all opacity-0 invisible pointer-events-none top-[calc(-100%-20px)] left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded after:content-[''] after:absolute after:border-[8px] after:border-transparent after:border-t-black after:left-1/2 after:-translate-x-1/2 after:top-full ${className}`}
      >
        {label}
      </div>
      {children}
    </div>
  );
};

export default TooltipText;
