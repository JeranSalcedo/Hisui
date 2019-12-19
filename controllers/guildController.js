const Q = require('q');
const Prefix = require('../models/Prefix');
const Role = require('../models/Role');

const prefixModel = new Prefix();
const roleModel = new Role();

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
}

module.exports = guildController;