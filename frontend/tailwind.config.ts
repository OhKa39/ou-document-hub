import { Inter, Poppins, Space_Grotesk } from "next/font/google";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
    },
    fontFamily:{
      Poppins: ["Poppins", "sans-serif"],
      Inter: ["Inter", "sans-serif"],
      Space_Grotesk: ["Space Grotesk", "sans-serif"],
    },
    colors:{
      "primary": "#000000",
      "secondary-blue": "#377DFF",
      "secondary-red": "#FF5630",
      "secondary-green": "#38CB89",
      "secondary-orange": "#FFAB00",
      "neutral-01": "#FEFEFE",
      "neutral-02": "#F3F5F7",
      "neutral-03": "#E8ECEF",
      "neutral-04": "#6C7275",
      "neutral-05": "#343839",
      "neutral-06": "#232627",
      "neutral-07": "#141718",
    },
    container: {
      center: true,
      padding: "2rem",
    },
  },
  plugins: [],
};
export default config;
