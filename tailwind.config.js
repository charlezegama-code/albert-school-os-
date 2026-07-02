/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:      '#1A2456',
        sky:       '#5BC4F5',
        'app-gray':'#F5F7FA',
        text:      '#1A1A2E',
        muted:     '#6B7280',
        amber:     '#F59E0B',
        red:       '#EF4444',
        green:     '#10B981',
        purple:    '#8B5CF6',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '12px' },
    },
  },
  plugins: [],
}

