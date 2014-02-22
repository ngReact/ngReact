module.exports = function(grunt) {

  grunt.initConfig({
    watch : {
      files: ['ngReact.js'],
      tasks: ['build'],
    },
    uglify: {
      'build-minify' : {
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['uglify']);
};