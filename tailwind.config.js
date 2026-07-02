/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface:  '#0A0E1A',
        card:     '#111827',
        elevated: '#1C2333',
        subtle:   '#1F2937',
        accent:   '#3B82F6',
        'accent-sky': '#0EA5E9',
        ink:      '#F9FAFB',
        muted:    '#6B7280',
        success:  '#10B981',
        warning:  '#F59E0B',
        danger:   '#EF4444',
      },
      fontFamily: { sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '8px' },
      fontSize: {
        '2xs': ['10px', '14px'],
      },
    },
  },
  plugins: [],
}
