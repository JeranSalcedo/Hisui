const Q = require('q');

class Role {
	getRole_type(guildId, type){
		const def = Q.defer();
		const query = `
			SELECT
				role
			FROM role
			WHERE
				server = ? AND
				type = ?
		`;

		db.query(query, [guildId, type], (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve(JSON.parse(JSON.stringify(data)));
			}
		});

		return def.promise;
	}

	addRole_type(guildId, roleId, type){
		const def = Q.defer();
		const query = `
			INSERT INTO
				role
			VALUES (
				?, ?, ?, ?
			)
		`;

		db.query(query, [guildId, type, 0, roleId], (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve(data.insertId);
			}
		});

		return def.promise;
	}

	updateRole_type(guildId, roleId, type){
		const def = Q.defer();
		const query = `
			UPDATE
				role
			SET
				role = ?
			WHERE
				server = ? AND
				type = ?
		`;

		db.query(query, [roleId, guildId, type], (err, data) => {
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