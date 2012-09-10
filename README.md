#Grunt task collection for Frontend Engineer

My Gruntfile.js, and package collection.

+  requirejs ( minify & build )
+  jst ( compile underscore templates )
+  lint & coffeelint
+  yuidoc ( with .coffee compatibility )
+  jasmine with phantomjs headless test
+  lossless image optimization
+  compile coffee script files
+  compile stylus files

#Installation

If you using grunt's version less than 0.4.0. You need to install development version.

    % npm run-script gruntdevel

This gruntfile buildset requires several libraries.

+  phantomjs
+  optipng
+  jpeg

Install by Homebrew.

    % brew install phantomjs optipng jpeg

At last installing dependent npm packages. Install is very easy. Just use the 'link' command.

    % npm link

#Appendix: Dirs

+ docs ( output documents )
+ src ( precompile source files )
    + img
    + stylus
    + coffee
    + tmpl
+ dist ( distributed files ready to deploy )
    + img
    + css
    + js
        + lib
    + tmpl
+ test ( headless test library )
    + lib
        + jasmine-1.2.0
    + spec
        + coffee
+ tasks ( original tasks )

#Todo

+  grunt-stylus replace to https://github.com/gruntjs/grunt-contrib-stylus