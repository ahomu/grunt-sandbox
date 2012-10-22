module.exports = function(grunt) {

  var exec  = require('child_process').exec,
      util  = grunt.util  || grunt.utils, // 0.4.0a || 0.3.x
      _     = util._,     // underscore.js
      async = util.async; // async.js

  grunt.registerMultiTask('noop', 'own task', function() {
    var files     = this.files || this.file,  // 0.4.0a || 0.3.x
        options   = this.options ? this.options() : this.data.options, // 0.4.0a || 0.3.x
        srcFiles  = grunt.file.expandFiles(files.src),
        destFiles = files.dest,
        done      = this.async();

    // exec `ls` command. this is sample :)
    exec('ls', function(err, stdout, stderr) {
      if (!err) {
        grunt.log.ok(stdout);
      } else {
        grunt.fail.warn('failed');
        grunt.fail.warn(stdout);
      }
      done();
    });

  });
};
