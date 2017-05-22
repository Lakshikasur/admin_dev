module.exports = function(grunt) {
  grunt.config.set('bower', {
    dev: {
      dest: '.tmp/public',
      js_dest: '.tmp/public/js/dependencies',
      css_dest: '.tmp/public/styles',
      min_dest: '.tmp/public/min',
      fonts_dest: '.tmp/public/fonts',
      options: {
        packageSpecific: {
          expand: true,
          'font-awesome': {
            files: [
              'fonts/fontawesome-webfont.eot',
              'fonts/fontawesome-webfont.svg',
              'fonts/fontawesome-webfont.ttf',
              'fonts/fontawesome-webfont.woff',
              'fonts/fontawesome-webfont.woff2',
              'fonts/FontAwesome.otf'
            ]
          },

          'bootstrap': {
            files: [
              'fonts/glyphicons-halflings-regular.eot',
              'fonts/glyphicons-halflings-regular.svg',
              'fonts/glyphicons-halflings-regular.ttf',
              'fonts/glyphicons-halflings-regular.woff',
              'fonts/glyphicons-halflings-regular.woff2'
            ]
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower');

};
