import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Home/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/OurTeam/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/AboutUs/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ContactUs/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Admin/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/BuyCar/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Details/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Profile/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Testimonials/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        foreground: "var(--color-text-dark)",
        navy: "var(--color-navy)",
        royal: "var(--color-royal)",
        sky: "var(--color-sky)",
        ghost: "var(--color-ghost)",
        gold: "var(--color-gold)",
        carbon: "var(--color-carbon)",
        muted: "var(--color-muted)",
        primary: "var(--color-royal)", /* Map primary to the action color */
      },
      fontFamily: {
        sans: ["var(--font-ui)"],
        display: ["var(--font-display)"],
      },
    },
  },
  plugins: [],
};
export default config;
