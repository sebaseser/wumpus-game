module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
    ],
    client: {
      jasmine: {
        random: false,
      },
      clearContext: false,
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: require('path').join(__dirname, 'coverage', 'wumpus-game'),
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    browsers: ['ChromeHeadless'],
    restartOnFileChange: true,
  });
};
