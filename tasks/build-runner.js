module.exports = function(grunt) {

  var ejsTmpl = require('ejs').compile(grunt.file.read('test/SpecRunner.ejs')),
        _     = grunt.util._,
       async  = grunt.util.async;

  grunt.registerMultiTask('build-runner', 'Build SpecRunner.html for jasmine', function() {
    var pairing = this.data.pairing,
         options = this.data.options,
         done = this.async(),
         changed = grunt.file.watchFiles.changed[0] || grunt.file.watchFiles.added[0],
         distFiles = [],
         testFiles = [];

    async.forEach(Object.keys(pairing), function(dist, next) {
      var test = pairing[dist];

      if (changed.indexOf(test) !== -1) {
        distFiles.push(changed.replace(test, dist));
        testFiles.push(changed);
      }
      else if (changed.indexOf(dist) !== -1) {
        distFiles.push(changed);
        testFiles.push(changed.replace(dist, test));
      }

      grunt.file.write('test/SpecRunner.html', ejsTmpl({
        distFiles : distFiles,
        testFiles : testFiles
      }));

      next();

    }, done);
  });
};