module.exports = function(grunt) {
  var exec = require('exec');

  /**
   * Task
   */
  grunt.registerMultiTask('coffeedoc', 'Generate source documents from CoffeeScript files.', function() {
    var target  = this.data.target,
        options = this.data.options || {},
        cmds    = ['coffeedoc'],
        done    = this.async();

    Object.keys(options).forEach(function(opt) {
      cmds.push('--' + opt + '=' + options[opt]);
    });

    cmds.push(target);

    exec(cmds, function(err, out, code) {
      if (code === 0) {
        grunt.log.ok(cmds.join(' '));
        grunt.log.ok('document created at '+target);
      } else {
        grunt.fail.warn('If you want to using coffeedoc task. Please global install (option with -g) coffeedoc pakage from npm.');
      }
      done();
    })
  });
};

