/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,tsx,md,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', '"Fira Code"', 'Consolas', '"Courier New"', 'monospace'],
      },
      colors: {
        term: {
          green:  '#00ff41',
          bright: '#39ff14',
          dim:    '#00aa2a',
          muted:  '#007a1f',
          dark:   '#003b0f',
          bg:     '#0d0d0d',
          card:   '#0a0a0a',
        },
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
