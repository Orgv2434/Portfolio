/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          50: 'rgba(255, 255, 255, 0.5)',
          100: 'rgba(255, 255, 255, 0.1)',
        }
      },
      backdropBlur: {
        xl: '20px',
        '2xl': '40px',
      },
      backgroundImage: {
        'noise': 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 100 100%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noiseFilter%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 result=%27noise%27/%3E%3CfeColorMatrix in=%27noise%27 type=%27saturate%27 values=%270.2%27/%3E%3C/filter%3E%3Crect width=%27100%27 height=%27100%27 filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E")',
      },
      animation: {
        'aurora': 'aurora 8s ease-in-out infinite',
        'skeleton': 'skeleton 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
          },
          '50%': { 
            backgroundPosition: '100% 50%',
          },
        },
        skeleton: {
          '0%': { backgroundColor: 'rgba(148, 163, 184, 0.2)' },
          '50%': { backgroundColor: 'rgba(148, 163, 184, 0.4)' },
          '100%': { backgroundColor: 'rgba(148, 163, 184, 0.2)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)' },
        }
      },
    },
  },
  plugins: [],
}
