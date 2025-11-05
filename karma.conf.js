// karma.conf.js
const webpackConfig = require('./config/webpack.config');

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'), // El lanzador de Brave depende de este
      require('karma-brave-launcher'),  // <-- **AÑADIDO: Para que Karma reconozca 'Brave'**
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
    ],

    files: [
      'src/tests/**/*.spec.js',
      'src/tests/**/*.spec.jsx'
    ],

    preprocessors: {
      'src/tests/**/*.spec.js': ['webpack', 'sourcemap'],
      'src/tests/**/*.spec.jsx': ['webpack', 'sourcemap']
    },

    webpack: {
      // **CAMBIADO: Usa la config 'test' para evitar el error de React Refresh**
      module: webpackConfig('test').module, 
      // **CAMBIADO: Usa la config 'test'**
      resolve: webpackConfig('test').resolve, 
      // **ELIMINADO: Ya no forzamos el modo 'development'**
      // mode: 'development', 
      devtool: 'inline-source-map',
      node: {
        global: true,
        __filename: true,
        __dirname: true,
      },
    },

    webpackMiddleware: {
      stats: 'errors-only'
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    // **CAMBIADO: Usa 'Brave' como navegador**
    browsers: ['Chrome'], 
    singleRun: false,
    concurrency: Infinity
  });
};