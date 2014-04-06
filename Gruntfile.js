module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
		  // define the files to lint
		  files: ['gruntfile.js', '*.js'],
		  // configure JSHint (documented at http://www.jshint.com/docs/)
		  options: {
	      // more options here if you want to override JSHint defaults
		  	eqeqeq: true,
		  	undef: true,
		  	unused: 'vars',
		  	latedef: true,
		  	indent: 4,
		  	curly: true,

		  	predef: [
		  		// nodejs
		  		'require',
		  		'setTimeout'
		  	],

		    globals: {
		      //jQuery: true,
		      console: true,
		      module: true
		    }
		  }
		},
		watch: {
		  files: ['<%= jshint.files %>'],
		  tasks: ['jshint']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// this would be run by typing "grunt test" on the command line
	grunt.registerTask('test', ['jshint']);

	// the default task can be run just by typing "grunt" on the command line
	grunt.registerTask('default', ['jshint']);
};