module.exports = function(grunt) {
  var exec = require('exec');

  /**
   * Task
   */
  grunt.registerMultiTask('jsdoc', 'Generate source documents from JavaScript files.', function() {
    var target  = this.data.target,
        options = this.data.options || {},
        cmds    = ['jsdoc'],
        done    = this.async();

    cmds.push(target);

    Object.keys(options).forEach(function(opt) {
      cmds.push('--' + opt + '=' + options[opt]);
    });

    exec(cmds, function(err, out, code) {
      if (code === 0) {
        grunt.log.ok(cmds.join(' '));
        grunt.log.ok('document created at '+target);
      } else {
        // grunt.fail.warn('If you want to using coffeedoc task. Please global install (option with -g) coffeedoc pakage from npm.');
        grunt.fail.warn();
      }
      done();
    });
  });
};

