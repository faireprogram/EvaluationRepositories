module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jasmine: {
            FrontEnd: {
                src: 'public/*.js',
                options: {
                    specs: 'spec/front/*Spec.js'
                },
                vendor: [
                    "public/libs/angular/angular.js",
                    "public/libs/angular-mocks/angular-mocks.js"
                ]
            },
            BackEnd: {
                src: 'public/*.js',
                options: {
                    specs: 'spec/back/*Spec.js'
                }
            }
        },
		
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jasmine');
	
	// grunt.loadNpmTasks('grunt-jasmine-nodejs');
    // Default task(s).
    grunt.registerTask('default', ['jasmine:FrontEnd', 'jasmine:BackEnd']);

};
