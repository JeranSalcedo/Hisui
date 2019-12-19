const Q = require('q');

class Role {
	getDefaultRole(guildId){
		const def = Q.defer();
		const query = `
			SELECT
				role
			FROM role
			WHERE
				server = ? AND
				isDefault = ?
		`;

		db.query(query, [guildId, 1], (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve(JSON.parse(JSON.stringify(data)));
			}
		});

		return def.promise;
	}

	addDefaultRole(guildId, roleId){
		const def = Q.defer();
		const query = `
			INSERT INTO
				role
			VALUES (
				?, ?, ?, ?
			)
		`;

		db.query(query, [guildId, 1, 0, roleId], (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve(data.insertId);
			}
		});

		return def.promise;
	}

	updateDefaultRole(guildId, roleId){
		const def = Q.defer();
		const query = `
			UPDATE
				role
			SET
				role = ?
			WHERE
				server = ? AND
				isDefault = ?
		`;

		db.query(query, [roleId, guildId, 1], (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve(data.insertId);
			}
		});

		return def.promise;
	}
}

module.exports = Role;