module.exports = {
  presets: [
    ['@babel/preset-env', { modules: false }]
  ],
  plugins: [
    '@babel/plugin-transform-runtime'
  ],
  env: {
    development: {
      sourceMaps: true,
      retainLines: true
    },
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: {
            node: 'current'
          }
        }]
      ]
    }
  }
}
