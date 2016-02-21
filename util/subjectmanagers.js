var $injector = require('../util/injector.js');
var Subject = require('../util/observer.js').AbstractSubject;

var SubjectManagers = function() {
	this.subjects = [];
}

SubjectManagers.prototype.find = function(subject) {
	var index = -1;
	this.subjects.forEach(function(item, ind) {
		if(item.equal(subject)) {
			index = ind;
		}
	});
	return index;
}

SubjectManagers.prototype.has = function(subject) {
	return this.find(subject) === -1 ? false : true;
}

SubjectManagers.prototype.add = function(subject) {
	if(subject && subject instanceof Subject) {
		if(!this.has(subject)) {
			this.subjects.push(subject);
		}
	}
}

SubjectManagers.prototype.dispatchMsg = function(msg) {
	this.subjects.forEach(function(subject) {
		subject.dispatchMsg(msg);
	});
}

module.exports = SubjectManagers;