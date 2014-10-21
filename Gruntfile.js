module.exports = function(grunt) {

  grunt.initConfig({
    watch : {
      files: ['ngReact.js', 'tests/*.js'],
      tasks: ['uglify', 'karma:background:run'],
    },
    uglify: {
      build : {
        options: {
          mangle: {
            except: ['angular', 'React']
          },
          compress: true,
          wrap: true
        },
        files: {
          'ngReact.min.js' : 'ngReact.js'
        }
      }
    },
    karma: {
      options: {
        configFile: 'karma.config.js'
      },
      background: {
        autoWatch: false,
        background: true,
        singleRun: false
      },
      single: {
        autoWatch: false,
        singleRun: true
      }
    },
    docco: {
      build : {
        src: ['ngReact.js'],
        options: {
          output: 'docs/'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['uglify', 'karma:single', 'docco']);
};