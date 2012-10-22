#global module:false
module.exports = (grunt) ->
  # Project configuration.
  grunt.initConfig
    meta: grunt.file.readJSON('package.json')
    banner: "/*! <%= meta.title || meta.name %> - v<%= meta.version %> - 
             <%= grunt.template.today(\"yyyy-mm-dd\") %>\n
             <%= meta.homepage ? \"* \" + meta.homepage + \"\\n\" : \"\" %>
             * Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= meta.author %>;
             Licensed <%= _.pluck([meta.license], \"type\").join(\", \") %> */\n"

    csslint:
      dist:
        src: ['dist/css/hoge.css']

    dataUri:
      hoge:
        src: ['dist/css/raw/*.css']
        dest: 'dist/css'
        options:
          target: ['dist/img/**/*.png']
          fixDirLevel: true

    # Document
    yuidoc:
      dist:
        name: "Project Name"
        description: "Project Description"
        version: "0.0.2"
        url: "http://projecturl.com/"
        options:
          paths: "src/coffee"
          
          # paths: 'dest/js',
          outdir: "docs"
          syntaxtype: "coffee"
          extension: ".coffee"

    # Build JavaScript
    # jst:
    #   compile:
    #     files:
    #       "dist/tmpl/templates.js": ["src/tmpl/*.html"]
    #     options:
    #       templateSettings: {}

    # interpolate : /\{\{(.+?)\}\}/g
    requirejs:
      dist:
        optimize: 'none'
        almond: true
        # replaceRequireScript: [{
        #   files: ['index.html'],
        #   module: 'main',
        #   modulePath: 'main-all'
        # }],
        # modules: [
        #   {name: 'main'},
        #   {name: 'sub'}
        # ],
        # dir: 'almond',
        # appDir: 'dist',
        baseUrl: "dist/js"
        include: ["main", "hoge"]
        paths: {
          lodash: 'lib/lodash.custom'
          backbone: 'lib/backbone'
          zepto: 'lib/zepto'
        }
        pragmas:
          doExclude: true
        skipModuleInsertion: false
        optimizeAllPluginResources: true
        findNestedDependencies: true
        out: "dist/js/all-min.js"

    # Headless test with jasmine
    buildRunner:
      part:
        pairing:
          "dist/js": "test/spec"
        watch: ["dist/js/**/*.js", "test/spec/**/*.js"]

    jasmine:
      part:
        src: ["test/SpecRunner.html"]
        errorReporting: true
      all:
        src: ["test/AllRunner.html"]
        errorReporting: true

    # Lossless image optimaization
    img:
      dist:
        src: ["src/img/**/*.png", "src/img/**/*.jpg", "src/img/**/*.jpeg"]
        dest: "dist/img"

    # CoffeeScript
    coffee:
      dist:
        files:
          "dist/js/*.js": ["src/coffee/**/*.coffee"]
      test:
        files:
          "test/spec/*.js": ["test/spec/coffee/**/*.coffee"]
    clint:
      dist:
        files: "<%= _.values(coffee.dist.files) %>"
      test:
        files: "<%= _.values(coffee.test.files) %>"

    # Stylus
    stylus:
      dist:
        files:
          "dist/css/test.css": "src/stylus/test.styl"
        options:
          "include css": true
          compress: true
          urlfunc: "emebedurl"
          paths: ["dist/img"]
        watch: ["src/stylus/**/*.styl"]

    # Watch
    watch:
      coffeedist:
        files: ["<%= _.values(coffee.dist.files) %>"]
        tasks: ['clint:dist', 'coffee:dist']
      coffeetest:
        files: ["<%= _.values(coffee.test.files) %>"]
        tasks: "coffee:test"
      jasmine:
        files: ["<%= buildRunner.part.watch %>"]
        tasks: ["buildRunner:part", "jasmine:part"]
      stylus:
        files: ["<%= stylus.dist.watch %>"]
        tasks: "stylus"

    # Config
    lint:
      options:
        curly: true
        eqeqeq: true
        immed: true
        latedef: true
        newcap: true
        noarg: true
        sub: true
        undef: true
        eqnull: true
        browser: true
      globals:
        jQuery: true
    coffeelint:
      no_tabs:
        level: "error"
      no_trailing_whitespace:
        level: "error"
      max_line_length:
        value: 80
        level: "error"
      camel_case_classes:
        level: "error"
      indentation:
        value: 2
        level: "error"
      no_implicit_braces:
        level: "ignore"
      no_trailing_semicolons:
        level: "error"
      no_plusplus:
        level: "ignore"
      no_throwing_strings:
        level: "error"
      yclomatic_complexity:
        value: 11
        level: "ignore"
      line_endings:
        value: "unix"
        level: "ignore"
      no_implicit_parens:
        level: "ignore"
    optipng:
      args: ["-o5"]
    jpegtran:
      rescan: "./jpegrescan"

  # Load
  grunt.loadNpmTasks "grunt-img"
  grunt.loadNpmTasks "grunt-jasmine-task"
  grunt.loadNpmTasks "grunt-contrib-stylus"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-yuidoc"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-requirejs"
  grunt.loadNpmTasks "grunt-data-uri"
  grunt.loadNpmTasks "grunt-csso"
  
  # Load Local
  grunt.loadTasks "tasks"
  
  # Default
  grunt.registerTask "default", ["noop"]

  # Browse
  grunt.registerTask "browse", ["server", 'watch']
  
  # Build
  grunt.registerTask "build", ["jst", "clint:dist", "requirejs:dist"]