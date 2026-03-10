export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        neon: {
          pink: '#ff2bd1',
          blue: '#00eaff',
          green: '#39ff14'
        }
      }
    }
  },
  plugins: []
}
