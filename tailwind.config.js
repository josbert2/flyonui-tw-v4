// tailwind.config.js


export const borderRadii = {
  '10': '.625rem',
  '20': '1.25rem',
} 


module.exports = {
    content: [
      
    ],
    plugins: [
      require("./flyonui"),
      require("./plugin") // Require only if you want to use FlyonUI JS component
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-sans)'],
          mono: ['var(--font-geist-mono)'],
        },
        borderRadius: {
          ...borderRadii,
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
        },
        keyframes: {
          'accordion-down': {
            from: { height: '0', opacity: '0' },
            to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          },
          'accordion-up': {
            from: {
              height: 'var(--radix-accordion-content-height)',
              opacity: '1',
            },
            to: { height: '0', opacity: '0' },
          },
        },
      },
    },
    
  }