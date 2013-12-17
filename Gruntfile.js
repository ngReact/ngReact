module.exports = function(grunt) {

  grunt.initConfig({
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

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['uglify']);
};