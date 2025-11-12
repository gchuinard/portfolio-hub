/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:"#f5e9ff",100:"#ead4ff",200:"#d4a9ff",300:"#bf7eff",
          400:"#a955ff",500:"#9333ea",600:"#7a28c5",700:"#641fa2",
          800:"#4e187f",900:"#3a125f"
        }
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" }
    }
  },
  plugins: []
}
