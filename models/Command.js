const Q = require('q');

class Command {
	getAction(guildId, command){
		const def = Q.defer();
		const query = `
			SELECT
				source,
				angle,
				x,
				y,
				size
			FROM command
			WHERE
				server = '${guildId}' AND
				command = '${command}'
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

	getActions(guildId){
		const def = Q.defer();
		const query = `
			SELECT
				command
			FROM command
			WHERE
				server = '${guildId}'
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

	addAction(guildId, command, source, angle, x, y, s){
		const def = Q.defer();
		const query = `
			INSERT INTO
				command
			VALUES (
				'${guildId}', '${command}','${source}', ${angle}, ${x}, ${y}, ${s}
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

	updateAction(guildId, command, angle, x, y, size){
		const def = Q.defer();
		const query = `
			UPDATE
				command
			SET
				angle = ${angle},
				x = ${x},
				y = ${y},
				size = ${size}
			WHERE
				server = '${guildId}' AND
				command = '${command}'
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

module.exports = Command;