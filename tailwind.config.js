export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        container: { center: true, padding: "1.5rem", screens: { "2xl": "1240px" } },
        extend: {
            fontFamily: { sans: ["Inter Tight", "system-ui", "sans-serif"] },
            colors: {
                ink: "#000000",
                charcoal: "#111111",
                panel: "#161616",
                mist: "#f4f4f4",
                violet: { DEFAULT: "#5b3df5", glow: "#8b74ff", soft: "#e9e4ff" },
                emerald: { DEFAULT: "#2fb98a", soft: "#dff6ec" },
                orchid: "#e6b8ec",
                blush: "#f8d4e2",
            },
            borderRadius: { "4xl": "2rem" },
            keyframes: {
                float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
                marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
            },
            animation: { float: "float 6s ease-in-out infinite", marquee: "marquee 30s linear infinite" },
        },
    },
};
