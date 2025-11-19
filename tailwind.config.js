/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        'dm-serif': ['var(--font-dm-serif)', 'serif'],
        // dm-serif-italic: ['var(--font-dm-serif-italic)', 'serif'],
        notable: ["var(--font-audiowide)", "sans-serif"], // Using Audiowide as notable
        'playfair': ["var(--font-playfair)", 'serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
