/**
 * `copy`
 *
 * ---------------------------------------------------------------
 *
 * Copy files and/or folders from your `assets/` directory into
 * the web root (`.tmp/public`) so they can be served via HTTP,
 * and also for further pre-processing by other Grunt tasks.
 *
 * #### Normal usage (`sails lift`)
 * Copies all directories and files (except CoffeeScript and LESS)
 * from the `assets/` folder into the web root -- conventionally a
 * hidden directory located `.tmp/public`.
 *
 * #### Via the `build` tasklist (`sails www`)
 * Copies all directories and files from the .tmp/public directory into a www directory.
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-copy
 *
 */
module.exports = function (grunt) {

  grunt.config.set('copy', {
    dev: {
      files: [{
        expand: true,
        cwd: './assets',
        src: ['**/*.!(coffee|less)'],
        dest: '.tmp/public'
      }
        , {
          expand: true,
          cwd: './bower_components',
          src: [
            'jquery/dist/jquery.js',
            'jquery-validation/dist/jquery.validate.min.js',
            'bootstrap/dist/js/bootstrap.min.js',
            'select2/dist/js/select2.min.js',
            'jquery-confirm2/dist/jquery-confirm.min.js',
            'angular-notification-icons/dist/angular-notification-icons.min.js',
            'bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js',
            'angular-base64/angular-base64.min.js',

          ],
          flatten: true,
          dest: 'assets/js/dependencies'
        },
        {
          expand: true,
          cwd: './bower_components',
          src: ['font-awesome/fonts/*','bootstrap/fonts/*'],
          flatten: true,
          dest: 'assets/fonts'
        },
        {
          expand: true,
          cwd: './bower_components',
          src: ['materialize/fonts/roboto/*'],
          flatten: true,
          dest: 'assets/fonts/roboto'
        },

        {
          expand: true,
          cwd: './assets/js/lib',
          src: ['**/*.!(coffee|less)'],
          dest: '.tmp/public/js/fontend'
        },
        {
          expand: true,
          cwd: './bower_components',
          src: ['select2/dist/css/select2.min.css','jquery-confirm2/dist/jquery-confirm.min.css',
               'angular-notification-icons/dist/angular-notification-icons.min.css',
               'angular-moment-picker/dist/angular-moment-picker.min.css',
               'textAngular/dist/textAngular.css'],
          flatten: true,
          dest: '.tmp/public/min'
        },



      ]
    },
    build: {
      files: [{
        expand: true,
        cwd: '.tmp/public',
        src: ['**/*'],
        dest: 'www'
      }]
    }
  });


  grunt.loadNpmTasks('grunt-contrib-copy');
};
