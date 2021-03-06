var exec = require('child_process').exec;
var Tail = require('tail').Tail;
var fs = require('fs');

require('colors');
var color = ['yellow', 'cyan', 'magenta', 'red', 'green']

var servicesToStart = function(){
	var serviceToStart = process.argv;
	var configuration =  fs.readFileSync(serviceToStart[2], 'utf8');
	var allServices = JSON.parse(configuration);

	var skipServices = serviceToStart.filter(function(s){
		return s.indexOf('-') == 0;
	});

	var filteredServices = [];

	if(skipServices.length){
		filteredServices = allServices.filter(function(s){
			return skipServices.indexOf('-'+s.alias.toLowerCase()) == -1;
		});
	}else{
		filteredServices = allServices.filter(function(s){
			return serviceToStart.indexOf(s.alias.toLowerCase()) > -1;
		});
	}

	return filteredServices.length == 0 ? allServices : filteredServices;
}


var services = servicesToStart();

var executeCommand = function(command){
	exec(command , function(err, stdout, stderr){
		console.log(stdout);
		err && console.log(err);
		stderr && console.log(stderr);
	});
};

var killService = function(service){
	command = 'cd _FOLDER_ && _COMMAND_'.replace(/_FOLDER_/, service.dir).replace(/_COMMAND_/,service.kill);
	console.log('Killing service - '.red + service.alias.toUpperCase());
	executeCommand(command);
};

var runService = function(service){
	command = 'cd _FOLDER_ && _COMMAND_'.replace(/_FOLDER_/, service.dir).replace(/_COMMAND_/,service.command);
	executeCommand(command);
};

var randomColor = function(){
	Array.prototype.random = function (length) {
	  return this[Math.floor((Math.random()*length))];
	}

	return color.pop(color.random(color.length))
}

services.forEach(function(service){
	runService(service);
	var logs = new Tail(service.log);
	service.logColor = randomColor();

	logs.on("line", function(data) {
	  serviceLog = service.alias.toUpperCase() + ' |';
	  console.log(serviceLog[service.logColor] + data);
	});
});

process.on('SIGINT', function () {
	services.forEach(function(service){
		killService(service);
	});
	process.exit();
});
