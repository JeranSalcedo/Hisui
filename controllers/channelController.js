const Q = require('q');
const Channel = require('../models/Channel');

const channelModel = new Channel();

class channelController {
	setChannel(guildId, channelId, num){
		const def = Q.defer();

		guildId = guildId.replace(/\D/g,'');
		channelId = channelId.replace(/\D/g,'');
		
		const checkRequest = channelModel.checkPreference(guildId, num);
		checkRequest.then(data => {
			if(data.length == 0){
				const addRequest = channelModel.addPreference(guildId, channelId, num);
				addRequest.then(() => {
					def.resolve();
				}, err => {
					def.reject(err);
				});
			} else {
				const updateRequest = channelModel.updatePreference(guildId, channelId, num);
				updateRequest.then(() => {
					def.resolve();
				}, err => {
					def.reject(err);
				});
			}
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}
}

module.exports = channelController;