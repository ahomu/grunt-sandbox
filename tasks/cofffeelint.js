module.exports = function(grunt) {

  var lint = require('coffeelint');

  /**
   * Task
   * task name is 'clint', but helper & global config name are 'coffeelint'
   */
  grunt.registerMultiTask('clint', 'Lint your CoffeeScript!', function() {
    var options = grunt.config('coffeelint'),
        changed = grunt.file.watchFiles.changed && grunt.file.watchFiles.changed[0];

    // overwride target option
    if (options[this.target]) {
      options = options[this.target];
    }

    // if changed file exists
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
        grunt.fail.warn('Failed coffeelint and stop task');
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
        grunt.log.error('Error in ' + filepath + ':');
        result.forEach(function(row) {
          grunt.log.error('L' + row.lineNumber + ': ' + row.message + ' (' + (row.value || '-') + ')');
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
