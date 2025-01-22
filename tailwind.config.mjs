import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

/** @type { import("tailwindcss").Config & { daisyui?: import("daisyui").Config } } */
export default {
    darkMode: "media",
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [typography, daisyui],
    daisyui: {
        themes: ["winter", "night"],
        darkTheme: "night",
        logs: false,
    },
};
