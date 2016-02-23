#!/usr/bin/env phantomjs
var system = require('system');
var sreenshot = require('./screenshot.js');


var args = system.args;
console.log(args);

args.slice(1).forEach(function(arg) {
	console.log(arg);
	sreenshot.grasp(arg).then(function() {
		phantom.exit();
	});
});
