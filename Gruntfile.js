module.exports = function(grunt) {

  grunt.initConfig({
    watch : {
      files: ['ngReact.js'],
      tasks: ['uglify'],
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

  grunt.registerTask('default', ['uglify', 'docco']);
};