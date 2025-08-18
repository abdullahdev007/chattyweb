/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "320px",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui"), require("@tailwindcss/line-clamp")],
  daisyui: {
    themes: [
      // Light Theme
      {
        chattyweb_light: {
          primary: "oklch(62.3% 0.245 264.5)", // بنفسجي أزرق
          secondary: "oklch(72.0% 0.205 142.2)", // أخضر فيروزي
          accent: "oklch(84.0% 0.425 98.5)", // أصفر/برتقالي

          neutral: "oklch(90.0% 0.010 255.0)", // خلفية فاتحة
          "base-100": "oklch(99.5% 0.015 255.0)",
          "base-200": "oklch(95.0% 0.010 255.0)",
          "base-300": "oklch(90.0% 0.010 255.0)",
          "base-content": "oklch(7.0% 0.025 250.0)", // نصوص داكنة

          info: "oklch(62.0% 0.180 210.0)",
          success: "oklch(72.0% 0.205 142.2)",
          warning: "oklch(84.0% 0.425 98.5)",
          error: "oklch(60.0% 0.400 30.0)",
        },
      },

      // Dark Theme
      {
        chattyweb_dark: {
          primary: "oklch(62.3% 0.245 264.5)", // بنفسجي أزرق
          secondary: "oklch(72.0% 0.205 142.2)", // أخضر فيروزي
          accent: "oklch(84.0% 0.425 98.5)", // أصفر/برتقالي

          neutral: "oklch(15.0% 0.010 255.0)", // خلفية داكنة
          "base-100": "oklch(15.0% 0.010 255.0)",
          "base-200": "oklch(20.0% 0.010 255.0)",
          "base-300": "oklch(25.0% 0.010 255.0)",
          "base-content": "oklch(95.0% 0.020 250.0)", // نصوص فاتحة

          info: "oklch(62.0% 0.180 210.0)",
          success: "oklch(72.0% 0.205 142.2)",
          warning: "oklch(84.0% 0.425 98.5)",
          error: "oklch(60.0% 0.400 30.0)",
        },
      },
    ],
  },
};
