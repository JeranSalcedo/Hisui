const Q = require('q');

class Channel {
	checkPreference(id, num){
		const def = Q.defer();
		const query = `
			SELECT
				channel
			FROM channel_preference
			WHERE
				server = ? AND
				num = ?
		`;

		db.query(query, [id, num], (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve(JSON.parse(JSON.stringify(data)));
			}
		});

		return def.promise;
	}

	addPreference(guildId, channelId, num){
		const def = Q.defer();
		const query = `
			INSERT INTO
				channel_preference
			VALUES (
				?, ?, ?
			)
		`;

		db.query(query, [guildId, channelId, num], (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve(data.insertId);
			}
		});

		return def.promise;
	}

	updatePreference(guildId, channelId, num){
		const def = Q.defer();
		const query = `
			UPDATE
				channel_preference
			SET 
				channel = ?
			WHERE
				server = ? AND
				num = ?
		`;

		db.query(query, [channelId, guildId, num], (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve(data.insertId);
			}
		});

		return def.promise;
	}
}

module.exports = Channel;