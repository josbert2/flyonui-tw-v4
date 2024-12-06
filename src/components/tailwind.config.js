const plugin = require('tailwindcss/plugin')
const responsiveRegex = require('../lib/responsiveRegex')
module.exports = {
  content: [{ raw: '' }],
  safelist: responsiveRegex,
  theme: {
    colors: require('../theming'),
    extend: require('../lib/utility-classes')
  },
  plugins: [
    require('../../plugin'),
    plugin(({ addBase, addUtilities, matchUtilities, matchComponents, theme }) => {
      addBase(require('../../dist/base'))
      addUtilities(require('../../dist/utilities'), {
        variants: ['responsive']
      })
      addUtilities(require('../../dist/utilities-unstyled'), {
        variants: ['responsive']
      })
      addUtilities(require('../../dist/utilities-styled'), {
        variants: ['responsive']
      })
    })
  ]
}
