/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Microsoft-inspired brand colors (unchanged palette)
        misc: {
          blue: "#0078D4",
          darkBlue: "#005A9E",
          lightBlue: "#2B88D8",
          purple: "#5C2D91",
          dark: "#0f172a", // Slate-900
          darker: "rgb(var(--misc-darker) / <alpha-value>)", // dark-mode page colour (charcoal), see index.css
          night: "rgb(var(--misc-night) / <alpha-value>)", // dark "band" sections: navy in light mode, near-black in dark mode
        },
      },
      fontFamily: {
        display: ['"Archivo Variable"', "Archivo", "Impact", "sans-serif"],
        sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-light":
          "radial-gradient(at 40% 20%, hsla(210,100%,90%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(260,100%,90%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(210,100%,95%,1) 0px, transparent 50%)",
        "mesh-dark":
          "radial-gradient(at 40% 20%, hsla(210,100%,15%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(260,100%,15%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(210,100%,10%,1) 0px, transparent 50%)",
      },
      animation: {
        blob: "blob 9s infinite",
        "spin-slow": "spin 8s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};
