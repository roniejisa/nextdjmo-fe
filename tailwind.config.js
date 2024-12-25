/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        main: "var(--main)",
        outline: "var(--outline)",
        danger: "var(--danger)",
      },
      backgroundImage: {
        'background-sidebar-admin': 'linear-gradient(to top, #fbf8dd, #f7e4ed, #d6def9, #ffffff 60%)',
      },
    },
  },
  plugins: [],
};
