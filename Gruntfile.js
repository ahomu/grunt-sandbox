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
    // Build JavaScript
    requirejs: {
      js: {
        almond: true,
        // replaceRequireScript: [{
        //   files: ['index.html'],
        //   module: 'main',
        //   modulePath: 'main-all'
        // }],
        // modules: [
        //   {name: 'main'},
        //   {name: 'sub'}
        // ],
        // dir: 'almond',
        // appDir: 'dist',
        baseUrl: 'dist/js',
        include: ['main', 'sub'],
        paths: {
            // underscore: '../vendor/underscore',
            // jquery    : '../vendor/jquery',
            // backbone  : '../vendor/backbone'
        },
        pragmas: {
            doExclude: true
        },
        skipModuleInsertion: false,
        optimizeAllPluginResources: true,
        findNestedDependencies: true,
        out: 'dist/js/all-min.js'
      }
    },
    jst: {
      compile: {
        files: {
          'dist/compiled/templates.js': ['src/tmpl/*.html']
        },
        options: {
          templateSettings: {
            // interpolate : /\{\{(.+?)\}\}/g
          }
        }
      }
    },
    // Headless test with jasmine
    'build-runner': {
      part: {
        pairing: {
          'dist/js' : 'test/spec'
        },
        options: {
          dummy: 'haha'
        },
        watch: ['dist/js/**/*.js', 'test/spec/**/*.js']
      }
    },
    jasmine: {
      part: {
        src: ['test/SpecRunner.html'],
        errorReporting: true
      },
      all: {
        src: ['test/AllRunner.html'],
        errorReporting: true
      }
    },
    // Lossless image optimaization
    img: {
      dist: {
        src: ['src/img/**/*.png', 'src/img/**/*.jpg', 'src/img/**/*.jpeg'],
        dest: 'dist/img'
      }
    },
    // CoffeeScript
    coffee: {
      dist: {
        src: ['src/coffee/**/*.coffee'],
        dest: 'dist/js'
      },
      test: {
        src: ['test/spec/coffee/**/*.coffee'],
        dest: 'test/spec'
      }
    },
    // Stylus
    stylus: {
      dist: {
        files: {
          'dist/css/test.css' : 'src/stylus/test.styl'
        },
        options: {
          'include css': true,
          compress: true,
          urlfunc: 'embedurl',
          paths: ['src/stylus']
        },
        watch: ['src/stylus/**/*.styl']
      }
    },
    // Watch
    watch: {
      coffeeDist: {
        files: ['<config:coffee.dist.src>'],
        tasks: 'coffee:dist'
      },
      coffeeTest: {
        files: ['<config:coffee.test.src>'],
        tasks: 'coffee:test'
      },
      jasmine: {
        files: ['<config:build-runner.part.watch>'],
        tasks: ['build-runner:part', 'jasmine:part']
      },
      stylus: {
        files: ['<config:stylus.dist.watch>'],
        tasks: 'stylus'
      }
    }
  });

  // Load
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-img');
  grunt.loadNpmTasks('grunt-jasmine-task');

  // Load ( overwrite grunt-contrib's tasks )
  grunt.loadNpmTasks('grunt-stylus');
  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-requirejs');

  // Load Local
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', ['noop']);
};
