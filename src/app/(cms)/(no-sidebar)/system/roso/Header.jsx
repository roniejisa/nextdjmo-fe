import React from "react";

/**
 * Modern header component with model selection dropdown
 * Features: 3D styling, responsive design, smooth animations
 */
const Header = ({ models }) => {
  // Find the default selected model
  const defaultModel = models?.find((model) => model?.default === 1);

  return (
    <HeaderContainer>
      <ModelSelector models={models} defaultValue={defaultModel?.name} />
    </HeaderContainer>
  );
};

/**
 * Container component for header positioning and styling
 */
const HeaderContainer = ({ children }) => {
  return (
    <div
      className="absolute top-4 left-4 z-50
      px-3 py-2 md:px-4 md:py-3
      bg-white/90 backdrop-blur-md
      rounded-xl md:rounded-2xl
      shadow-lg shadow-black/10
      border border-white/20
      transform-gpu
      hover:shadow-xl hover:shadow-black/15
      transition-all duration-300 ease-out
      hover:scale-[1.02]
      group
    "
    >
      {children}
    </div>
  );
};

/**
 * Model selection dropdown with modern styling
 */
const ModelSelector = ({ models, defaultValue }) => {
  return (
    <div className="relative">
      <select
        id="model"
        defaultValue={defaultValue}
        className="
          appearance-none
          bg-gradient-to-r from-slate-50 to-white
          border-2 border-slate-200/60
          rounded-lg md:rounded-xl
          px-3 py-2 md:px-4 md:py-2.5
          pr-8 md:pr-10
          text-sm md:text-base
          font-medium text-slate-700
          min-w-[120px] md:min-w-[160px]
          cursor-pointer
          outline-none
          transform-gpu
          transition-all duration-200 ease-out
          
          hover:border-blue-300
          hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
          hover:text-slate-800
          hover:shadow-md
          hover:scale-[1.01]
          
          focus:border-blue-400
          focus:bg-white
          focus:ring-4 focus:ring-blue-100
          focus:shadow-lg
          focus:scale-[1.02]
          
          active:scale-[0.99]
          
          disabled:opacity-60
          disabled:cursor-not-allowed
          disabled:hover:scale-100
        "
      >
        {models?.map((model) => (
          <ModelOption
            key={model.name}
            value={model.name}
            label={model.label}
          />
        ))}
      </select>

      {/* Custom dropdown arrow with 3D effect */}
      <DropdownArrow />
    </div>
  );
};

/**
 * Individual option component for better readability
 */
const ModelOption = ({ value, label }) => {
  return (
    <option
      value={value}
      className="
        py-2 px-3
        text-slate-700
        bg-white
        hover:bg-slate-50
      "
    >
      {label}
    </option>
  );
};

/**
 * Custom dropdown arrow with modern styling
 */
const DropdownArrow = () => {
  return (
    <div
      className="
      absolute right-2 md:right-3 top-1/2 
      transform -translate-y-1/2
      pointer-events-none
      text-slate-400
      group-hover:text-slate-600
      transition-colors duration-200
    "
    >
      <svg
        className="w-4 h-4 md:w-5 md:h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
};

export default Header;
