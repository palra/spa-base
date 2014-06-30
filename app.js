var server = require('./server');

var cp = require('child_process');
var grunt = cp.spawn('grunt', [
	'--gruntfile',
	'client/Gruntfile.js',
	'--force',
	'watch'
]);

grunt.stdout.on('data', function(data) {
    console.log(data+'');
});