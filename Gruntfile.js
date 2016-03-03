module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jasmine: {
            customTemplate: {
                src: 'public/*.js',
                options: {
                    specs: 'spec/*Spec.js',
                    helpers: 'spec/*Helper.js'
                },
                vendor: [
                    "public/libs/angular/angular.js",
                    "public/libs/angular-mocks/angular-mocks.js"
                ]
            }
        },
		
		
		
		
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-jasmine');
	
	grunt.loadNpmTasks('grunt-jasmine-nodejs');
    // Default task(s).
    grunt.registerTask('default', ['jasmine']);

};
