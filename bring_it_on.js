var exec = require('child_process').exec;
var Tail = require('tail').Tail;
var fs = require('fs');

require('colors');

var configuration =  fs.readFileSync('./config.json', 'utf8');
var services = JSON.parse(configuration);

var executeCommand = function(command){
	exec(command , function(err, stdout, stderr){
		console.log(stdout);
		err && console.log(err);
		stderr && console.log(stderr);
	});
};

var killService = function(service){
	command = 'cd _FOLDER_ && sh _COMMAND_'.replace(/_FOLDER_/, service.dir).replace(/_COMMAND_/,service.kill);
	console.log('Killing service - '.red + service.dir);
	executeCommand(command);
};

var runService = function(service){
	command = 'cd _FOLDER_ && sh _COMMAND_'.replace(/_FOLDER_/, service.dir).replace(/_COMMAND_/,service.command);
	executeCommand(command);
};

services.forEach(function(service){
	runService(service);
});

merchLogs = new Tail("../merchandise_services/tmp/merchandise-platform.log");
gecoLogs = new Tail("../geco_integration/tmp/geco-integration.log");

merchLogs.on("line", function(data) {
  console.log('MERCH| '.green + data);
});

gecoLogs.on("line", function(data){
  console.log('GECO | '.red + data);
});

process.on('SIGINT', function () {
	services.forEach(function(service){
		killService(service);
	});
	process.exit();
});
