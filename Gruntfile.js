module.exports = function(grunt) {
  var config = {
    browserify: {
      options: {
        transform: ['reactify']
      },
      dist: {
        files: {
          'build/client.js': [
            'views/*.js',
            'lib/*.js',
            'models/*.js'
          ]
        }
      }
    },

    watch: {
      options: {
        livereload: true,
        spawn: false
      },
      browserify: {
        files: [
          'views/*.js',
          'lib/*.js',
          'models/*.js'
        ],
        tasks: 'browserify:dist'
      }
    },

    jshint: {
      all: [
        'Gruntfile.js',
        'views/*.js',
        'lib/*.js',
        'models/*.js'
      ],

      options: {
        'curly': true,
        'eqeqeq': true,
        'globals': {
          'jQuery': true,
          '$': true,
          'document': true,
          'window': true,
          'io': true
        },
        'forin': true,
        'immed': true,
        'indent': 2,
        'latedef': true,
        'newcap': true,
        'noarg': true,
        'sub': true,
        'unused': true,
        'undef': true,
        'boss': true,
        'eqnull': true,
        'node': true,
        'quotmark': 'single',
        'trailing': true
      }
    }
  };

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('build', 'browserify:dist');
};
