/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"]
      },
      colors: {
        ink: "#06141b",
        shell: "#f4f7f5",
        surge: "#17a673",
        "surge-light": "#e6f9f1",
        ember: "#ff7849",
        "ember-light": "#fff1eb",
        ocean: "#0d4c92",
        "ocean-light": "#e8f0fa",
        smog: "#8b9aad",
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.80)",
          heavy: "rgba(255, 255, 255, 0.92)"
        }
      },
      boxShadow: {
        lift: "0 18px 48px rgba(6, 20, 27, 0.10)",
        "lift-lg": "0 24px 64px rgba(6, 20, 27, 0.14)",
        glow: "0 0 24px rgba(23, 166, 115, 0.25)",
        "glow-ocean": "0 0 24px rgba(13, 76, 146, 0.20)",
        subtle: "0 2px 12px rgba(6, 20, 27, 0.06)",
        card: "0 4px 24px rgba(6, 20, 27, 0.08)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(6, 20, 27, 0.06) 1px, transparent 0)",
        "gradient-surge": "linear-gradient(135deg, #17a673 0%, #0d9463 100%)",
        "gradient-ocean": "linear-gradient(135deg, #0d4c92 0%, #1a6dd1 100%)",
        "gradient-ink": "linear-gradient(135deg, #06141b 0%, #0f2b3a 100%)",
        "gradient-ember": "linear-gradient(135deg, #ff7849 0%, #ff9a6c 100%)",
        "gradient-hero": "linear-gradient(135deg, rgba(23, 166, 115, 0.08) 0%, rgba(13, 76, 146, 0.08) 100%)"
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem"
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "fade-up": "fadeUp 0.5s ease forwards",
        "slide-in-left": "slideInLeft 0.4s ease forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "scale-in": "scaleIn 0.3s ease forwards",
        shimmer: "shimmer 2s linear infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        slideInLeft: {
          "0%": { opacity: 0, transform: "translateX(-20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 }
        },
        scaleIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      }
    }
  },
  plugins: []
};
