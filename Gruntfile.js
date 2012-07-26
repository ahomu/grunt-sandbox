/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
      ' Licensed <%= _.pluck([pkg.license], "type").join(", ") %> */\n',
    jst: {
      main: {
        src:  [''],
        dest: ''
      }
    },
    concat: {
      dist: {
        src: ['dist/js/**/*.js'],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<config:concat.dist.dest>'],
        dest: '<%= grunt.config("concat").dist.dest.replace(/js$/, "min.js") %>'
      }
    },
    sutaba: {
      fromTo: {
        'src/coffee'      : 'dist/js',
        'test/spec_coffee': 'test/spec'
      },
      watch: ['src/coffee/**/*.coffee', 'test/spec_coffee/**/*.coffee']
    },
    stylus: {
      app: {
        src : ['src/stylus/*.styl'],
        dest: 'dist/css/<%= pkg.name %>.css'
      }
    },
    watch: {
      sutaba: {
        files: '<config:sutaba.watch>',
        tasks: 'sutaba'
      },
      autospec: {
        files: ['dist/js/**/*.js', 'test/spec/**/*.js'],
        tasks: 'autospec'
      },
      stylus: {
        files: ['<config:stylus.app.src>'],
        tasks: 'stylus'
      }
    }
  });

  // Load
  grunt.loadNpmTasks('grunt-contrib');

  // require
  var ejsTmpl = require('ejs').compile(grunt.file.read('test/SpecRunner.ejs')),
      growl   = require('growl'),
      exec    = require('exec');

  /**
   * Auto create SpecRunner.html and execute phantomjs.
   *
   * {Array}    changedFiles
   * {Function} asyncDone
   */
  grunt.registerHelper('phantomspec', function(changedFiles, asyncDone) {
    var params = {
          path : []
        };

    if (!changedFiles.length) {
      return;
    }

    changedFiles.forEach(function(filename) {
      // spec modified
      if (filename.indexOf('test/spec') === 0) {
        params.path.push(filename);
        params.path.push(filename.replace('test/spec', 'dist/js'));
      }
      // dest modified
      else if (filename.indexOf('dist/js') === 0) {
        params.path.push(filename.replace('dist/js', 'test/spec'));
        params.path.push(filename);
      }
    });
    params.path = grunt.util._.uniq(params.path);
    grunt.file.write('test/SpecRunner.html', ejsTmpl(params));

    exec(['phantomjs', '--load-images=no', 'test/lib/run.jasmine.phantom.js', 'test/SpecRunner.html'], function(err, out, code) {
      if (err) {
        throw err;
      }
      console.log(out+'------------------------------------------------------');
      var mess = out.replace(/\[1m/g, '')
                    .replace(/\[0m/g, '')
                    .replace(/\[32m/g, '')
                    .replace(/\[31m/g, ''),
          options = {
            // ...some options...
          }
      ;
      growl(mess, options);
      asyncDone();
    });
  });

  // autospec
  grunt.registerTask('autospec', function() {
    grunt.helper('phantomspec', grunt.file.watchFiles.changed, this.async());
  });

  // coffee compile single file
  grunt.registerTask('sutaba', function() {
    var done = this.async,
        changedSrc= grunt.file.watchFiles.changed[0] || grunt.file.watchFiles.added[0],
        fromTo = grunt.config('sutaba').fromTo;

    Object.keys(fromTo).forEach(function(path) {
      if (changedSrc.indexOf(path) === 0) {
        exec(['coffee', '-c', '-o', fromTo[path], changedSrc], function(err, out, code) {
          done();
        });
      }
    });
  });

  // deploy?
  grunt.registerTask('deploy', function() {

  });

  // Default task.
  grunt.registerTask('default', 'concat min deploy');
};
