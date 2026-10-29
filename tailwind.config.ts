import type { Config } from "tailwindcss";

// Paleta Páramo. Tokens y contrastes en el kit de marca (brand/, fuera del repo).
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1240px" } },
    extend: {
      fontFamily: {
        sans: ["Inter Tight", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter Tight", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        tinta: "#0E1511",
        grafito: { DEFAULT: "#1A231E", 2: "#243029" },
        papel: "#F4F2EB",
        arena: "#EBE7DC",
        linea: "#DAD6CB",
        texto2: "#59615A",
        "gris-oscuro": "#A7AFA8",
        paramo: { DEFAULT: "#1C5A43", hondo: "#14432F", puente: "#3C8C68", luz: "#6CC19A", suave: "#DCEBE2" },
        maiz: { DEFAULT: "#E3B23C", claro: "#EDC463", ocre: "#A87B12", texto: "#7E5E00", suave: "#F7EBCB" },
        error: { DEFAULT: "#B42318", oscuro: "#F87171" },
      },
      borderRadius: { "4xl": "2rem" },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: { float: "float 6s ease-in-out infinite", marquee: "marquee 30s linear infinite" },
    },
  },
} satisfies Config;
