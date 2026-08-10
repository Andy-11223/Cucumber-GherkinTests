module.exports = {
  default: {
    requireModule: ['tsx'],
    require: [
      'features/support/**/*.ts',
      'features/step_definitions/**/*.ts'
    ],
    format: ['progress', 'html:cucumber-report.html'],
    paths: ['features/**/*.feature'],
    publishQuiet: true
  }
};