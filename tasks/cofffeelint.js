module.exports = function(grunt) {

  var lint = require('coffeelint');

  /**
   * Task
   */
  grunt.registerMultiTask('coffeelint', 'Lint your CoffeeScript!', function() {
    var options = this.data.options,
        changed = grunt.file.watchFiles.changed && grunt.file.watchFiles.changed[0];

    if (changed) {
      if (grunt.file.expandFiles(this.data.files).indexOf(changed) !== -1) {
          src = [changed];
      } else {
        return true;
      }
    } else {
      src = grunt.file.expandFiles(this.data.files);
    }

    src.forEach(function(filepath) {
      grunt.helper('coffeelint', filepath, grunt.util._.clone(options));
    });

    if (!grunt.task.current.errorCount) {
      grunt.log.ok('Passed coffeelint');
      return true;
    } else {
      // not watch
      if (!changed) {
        grunt.fatal('Failed coffeelint and stop task');
        return false;
      } else {
        grunt.log.error('Failed coffeelint');
        return true;
      }
    }
  });

  /**
   * Helper
   */
  grunt.registerHelper('coffeelint', function(filepath, options) {
    var result;
    options = options || {};
    try {
      result = lint.lint(grunt.file.read(filepath), options);
      if (result.length) {
        grunt.log.error('Error in ' + filepath + ':\n');
        result.forEach(function(row) {
          grunt.log.error('L' + row.lineNumber + ': ' + row.message + ' (' + (row.value || '-') + ')\n');
        });
        return false;
      }
      return true;
    } catch (e) {
      grunt.log.error('Error in ' + filepath + ':\n' + e);
      return false;
    }
  });
};
