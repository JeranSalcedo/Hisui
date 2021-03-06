const Q = require('q');
const Prefix = require('../models/Prefix');
const Role = require('../models/Role');
const Command = require('../models/Command');

const prefixModel = new Prefix();
const roleModel = new Role();
const commandModel = new Command();

class guildController {
	getPrefix(guildId){
		const def = Q.defer();

		const checkRequest = prefixModel.getPrefix(guildId);
		checkRequest.then(data => {
			if(data.length == 0){
				const addRequest = prefixModel.addPrefix(guildId);
				addRequest.then(data => {
					def.resolve('!h ');
				}, err => {
					def.reject(err);
				});
			} else {
				def.resolve(data[0].prefix);
			}
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}

	setRole_type(guildId, roleId, type){
		const def = Q.defer();

		roleId = roleId.replace(/\D/g,'');

		const checkRequest = roleModel.getRole_type(guildId, type);
		checkRequest.then(data => {
			if(data.length == 0){
				const addRequest = roleModel.addRole_type(guildId, roleId, type);
				addRequest.then(() => {
					def.resolve(true);
				}, err => {
					def.reject(err);
				});
			} else {
				if(roleId === data[0].role){
					def.resolve(false);
				} else {
					const updateRequest = roleModel.updateRole_type(guildId, roleId, type);
					updateRequest.then(() => {
						def.resolve(true);
					}, err => {
						def.reject(err);
					});
				}
			}
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}

	addAction(guildId, command, source, angle, x, y, s){
		const def = Q.defer();

		const request = commandModel.addAction(guildId, command, source, angle, x, y, s);
		request.then(data => {
			def.resolve();
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}

	updateAction(guildId, command, angle, x, y, s){
		const def = Q.defer();

		const request = commandModel.updateAction(guildId, command, angle, x, y, s);
		request.then(data => {
			def.resolve({guildId, command, angle, x, y, s});
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}

	getAction(guildId, command){
		const def = Q.defer();

		const request = commandModel.getAction(guildId, command);
		request.then(data => {
			def.resolve(data[0]);
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}

	getActions(guildId){
		const def = Q.defer();

		const request = commandModel.getActions(guildId);
		request.then(data => {
			def.resolve(data);
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}
}

module.exports = guildController;