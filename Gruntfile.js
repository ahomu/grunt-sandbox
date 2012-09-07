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
    // Document
    yuidoc: {
      dist: {
        'name': 'Project Name',
        'description': 'Project Description',
        'version': '0.0.2',
        'url': 'http://projecturl.com/',
        options: {
          paths: 'src/coffee',
          // paths: 'dest/js',
          outdir: 'docs',
          syntaxtype: 'coffee',
          extension: '.coffee'
        }
      }
    },
    // Build JavaScript
    jst: {
      compile: {
        files: {
          'dist/tmpl/templates.js': ['src/tmpl/*.html']
        },
        options: {
          templateSettings: {
            // interpolate : /\{\{(.+?)\}\}/g
          }
        }
      }
    },
    requirejs: {
      dist: {
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
    // Headless test with jasmine
    'build-runner': {
      part: {
        pairing: {
          'dist/js' : 'test/spec'
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
    clint: {
      dist: {
        files: ['<config:coffee.dist.src>']
      },
      test: {
        files: ['<config:coffee.test.src>']
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
      coffeedist: {
        files: ['<config:coffee.dist.src>'],
        tasks: 'clint:dist coffee:dist'
      },
      coffeetest: {
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
    },
    // Config
    lint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    coffeelint: {
      'no_tabs' : {
        'level' : 'error'
      },
      'no_trailing_whitespace' : {
        'level' : 'error'
      },
      'max_line_length' : {
        'value': 80,
        'level' : 'error'
      },
      'camel_case_classes' : {
        'level' : 'error'
      },
      'indentation' : {
        'value' : 2,
        'level' : 'error'
      },
      'no_implicit_braces' : {
        'level' : 'ignore'
      },
      'no_trailing_semicolons' : {
        'level' : 'error'
      },
      'no_plusplus' : {
        'level' : 'ignore'
      },
      'no_throwing_strings' : {
        'level' : 'error'
      },
      'yclomatic_complexity' : {
        'value' : 11,
        'level' : 'ignore'
      },
      'line_endings' : {
        'value' : 'unix',
        'level' : 'ignore'
      },
      'no_implicit_parens' : {
        'level' : 'ignore'
      }
    },
    optping: {
      args: ['-o5']
    },
    jpegtran: {
      rescan: './jpegrescan'
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

  // Default
  grunt.registerTask('default', ['noop']);

  // Build
  grunt.registerTask('build', ['jst', 'clint:dist', 'requirejs:dist']);
};
