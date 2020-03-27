const tailwindcss = require('tailwindcss');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  map: true,
  plugins: [
    tailwindcss('./tailwind.js'),
    require('autoprefixer'),
    postcssPresetEnv({
      stage: 2,
    }),
  ]
}