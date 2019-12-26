const Q = require('q');

class Channel {
	checkPreference(id, num){
		const def = Q.defer();
		const query = `
			SELECT
				channel
			FROM channel_preference
			WHERE
				server = '${id}' AND
				num = ${num}
		`;

		db.query(query, (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve(data.rows);
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
				'${guildId}', '${channelId}', ${num}
			)
		`;

		db.query(query, (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve();
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
				channel = '${channelId}'
			WHERE
				server = '${guildId}' AND
				num = ${num}
		`;

		db.query(query, (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve();
			}
		});

		return def.promise;
	}
}

module.exports = Channel;