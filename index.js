const Discord = require('discord.js');
const { Client } = require('pg');

const GuildController = require('./controllers/guildController');
const ChannelController = require('./controllers/channelController');

const guildController = new GuildController();
const channelController = new ChannelController();

const connection = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: true
});

connection.connect(err => {
    if(err){
        throw err;
    }

    console.log('Connected to the database');
});
global.db = connection;

const client = new Discord.Client();

var prefixes = {};
var channels = {};

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.guilds.forEach(guild => {
		guildController.getPrefix(guild.id).then(data => {
			prefixes[guild.id] = data;
		}, err => {
			throw err;
		});

		channelController.getChannels(guild.id).then(data => {
			channels[guild.id] = data;

			if(channels[guild.id] !== undefined && channels[guild.id][2] !== undefined){
				guild.channels.find(channel => (
					channel.id === channels[guild.id][2]
				)).fetchMessages().then(messages => {
					messages.forEach(message => {
						if(message.embeds.length > 0){
							message.clearReactions().then(() => {
								message.react('✅').then(r => {
									message.react('❌');
								}).catch(console.error);

								watchRoleReact(message.guild, message, message.embeds[0].fields[0].value.replace(/\D/g, ''));
							});
						}
					});
				});
			}
		}, err => {
			throw err;
		});
	});
});

client.on('message', message => {
	if(message.channel.type === 'dm'){
		console.log(message.content);
		console.log(message.author.id);
		if(message.content === '!slam <@!254289067875893259>' && message.author.id === '254289067875893259'){
			message.channel
				.send('!slam <@273579032098897922>')
				.then(console.log(`Sent message: ${message.content}`))
		}

		if(!message.author.bot && message.content.startsWith('!h ')){
			elements = message.content.split(/ +/).slice(1);

			cmd = elements[0];
			args = elements.slice(1);

			switch(cmd.toLowerCase()){
				case 'sm':
				case 'sendmessage':
					if(args.length < 3 || args[0].replace(/\D/g,'').length < 18 || args[1].replace(/\D/g,'').length < 18){
						message.channel
							.send(`Command format is:\n\t!h ${cmd} *<server> <channel> <message>*`)
							.then(console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					} else {
						client.guilds.get(args[0]).channels.get(args[1])
							.send(args.slice(2).join(' '))
							.then(console.log(`Sent message: ${message.content}`))
							.catch(console.error);

						message.channel
							.send(`Message sent to ${client.guilds.get(args[0]).name}: ${client.guilds.get(args[0]).channels.get(args[1]).name}`)
							.then(console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					}
			}
		}
	} else {
		// if(
		// 	message.guild.id === '655852590931640330' &&
		// 	Math.floor(Math.random() * 10) < 2 &&
		// 	(
		// 		message.author.id === '273579032098897922' ||
		// 		message.author.id === '243749854088527873' ||
		// 		message.author.id === '574261866654597120' ||
		// 		message.author.id === '543240597972975644' ||
		// 		message.author.id === '254819083999117313' ||
		// 		message.author.id === '487235836568403978'
		// 	)
		// ){
		// 	switch(Math.floor(Math.random() * 18)){
		// 		case 0:
		// 			message.react(message.guild.emojis.get('655873700926849036'))
		// 				.then(console.log(`Reacted with 655873700926849036`))
		// 				.catch(console.error);
		// 			break;

		// 		case 1:
		// 			message.react(message.guild.emojis.get('655873724205105182'))
		// 				.then(console.log(`Reacted with 655873724205105182`))
		// 				.catch(console.error);
		// 			break;

		// 		case 2:
		// 			message.react(message.guild.emojis.get('655873769663103010'))
		// 				.then(console.log(`Reacted with 655873769663103010`))
		// 				.catch(console.error);
		// 			break;

		// 		case 3:
		// 			message.react(message.guild.emojis.get('655873817255608321'))
		// 				.then(console.log(`Reacted with 655873817255608321`))
		// 				.catch(console.error);
		// 			break;

		// 		case 4:
		// 			message.react(message.guild.emojis.get('655873837245661239'))
		// 				.then(console.log(`Reacted with 655873837245661239`))
		// 				.catch(console.error);
		// 			break;

		// 		case 5:
		// 			message.react(message.guild.emojis.get('655873855365185547'))
		// 				.then(console.log(`Reacted with 655873855365185547`))
		// 				.catch(console.error);
		// 			break;

		// 		case 6:
		// 			message.react(message.guild.emojis.get('655873877884534845'))
		// 				.then(console.log(`Reacted with 655873877884534845`))
		// 				.catch(console.error);
		// 			break;

		// 		case 7:
		// 			message.react(message.guild.emojis.get('655873914689552404'))
		// 				.then(console.log(`Reacted with 655873914689552404`))
		// 				.catch(console.error);
		// 			break;

		// 		case 8:
		// 			message.react(message.guild.emojis.get('655873974991061012'))
		// 				.then(console.log(`Reacted with 655873974991061012`))
		// 				.catch(console.error);
		// 			break;

		// 		case 9:
		// 			message.react(message.guild.emojis.get('655874000152690699'))
		// 				.then(console.log(`Reacted with 655874000152690699`))
		// 				.catch(console.error);
		// 			break;

		// 		case 10:
		// 			message.react(message.guild.emojis.get('655874019995942923'))
		// 				.then(console.log(`Reacted with 655874019995942923`))
		// 				.catch(console.error);
		// 			break;

		// 		case 11:
		// 			message.react(message.guild.emojis.get('655874185251389460'))
		// 				.then(console.log(`Reacted with 655874185251389460`))
		// 				.catch(console.error);
		// 			break;

		// 		case 12:
		// 			message.react(message.guild.emojis.get('655874248966930452'))
		// 				.then(console.log(`Reacted with 655874248966930452`))
		// 				.catch(console.error);
		// 			break;

		// 		case 13:
		// 			message.react(message.guild.emojis.get('655874298388676645'))
		// 				.then(console.log(`Reacted with 655874298388676645`))
		// 				.catch(console.error);
		// 			break;

		// 		case 14:
		// 			message.react(message.guild.emojis.get('656147573094088734'))
		// 				.then(console.log(`Reacted with 656147573094088734`))
		// 				.catch(console.error);
		// 			break;

		// 		case 15:
		// 			message.react(message.guild.emojis.get('658713308559441961'))
		// 				.then(console.log(`Reacted with 658713308559441961`))
		// 				.catch(console.error);
		// 			break;

		// 		case 16:
		// 			message.react(message.guild.emojis.get('658713534351409162'))
		// 				.then(console.log(`Reacted with 658713534351409162`))
		// 				.catch(console.error);
		// 			break;

		// 		case 17:
		// 			message.react(message.guild.emojis.get('656648297305473065'))
		// 				.then(async react => {
		// 					await message.react(message.guild.emojis.get('656648325839192094'));
		// 					await message.react(message.guild.emojis.get('656648346013794314'));
		// 				})
		// 				.catch(console.error);
		// 			break;
		// 	}
		/*} else*/ /*if(Math.floor(Math.random() * 10) < 10 && message.guild.id === '655852590931640330' && message.author.id === '273579032098897922'){

				message.react(message.guild.emojis.get('660708929218674708'))
					.then(console.log(`Reacted with 660708929218674708`))
					.catch(console.error);
		}*/

		if((message.content === '!slam <@!254289067875893259>' || message.content === '!slam <@!656810218272849920>') && message.author.id === '273579032098897922'){
			message.channel
				.send('!slam <@273579032098897922>')
				.then(console.log(`Sent message: ${message.content}`))
		}

		if(!message.author.bot && message.member.hasPermission('ADMINISTRATOR') && message.content.startsWith(prefixes[message.guild.id])){
			elements = message.content.split(/ +/).slice(1);

			cmd = elements[0];
			args = elements.slice(1);

			switch(cmd.toLowerCase()){
				case 'sc':
				case 'setchannel':
					if(args.length != 2){
						message.channel
							.send(`Command format is:\n\t${prefixes[message.guild.id]}${cmd} *<channel> <number>*`)
							.then(console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					} else {
						channelController.setChannel(message.guild.id, args[0], args[1]).then(() => {
							message.channel
								.send(`Channel preferences updated!`)
								.then(console.log(`Sent message: ${message.content}`))
								.catch(console.error);

							if(channels[message.guild.id] === undefined){
								channels[message.guild.id] = {
									[args[1]]: args[0].replace(/\D/g,'')
								};
							}
						}, err => {
							throw err;
						});
					}

					break;

				case 'sdr':
				case 'setdefaultrole':
					if(args.length != 1){
						message.channel
							.send(`Command format is:\n\t${prefixes[message.guild.id]}${cmd} *<role>*`)
							.then(console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					} else {
						guildController.setRole_type(message.guild.id, args[0], 0).then(changed => {
							message.channel
								.send(changed? `Default role updated!` : `${args[0]} is already the default role!`)
								.then(console.log(`Sent message: ${message.content}`))
								.catch(console.error);
						}, err => {
							throw err;
						});
					}

					break;

				case 'sbr':
				case 'setbotrole':
					if(args.length != 1){
						message.channel
							.send(`Command format is:\n\t${prefixes[message.guild.id]}${cmd} *<role>*`)
							.then(console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					} else {
						guildController.setRole_type(message.guild.id, args[0], 1).then(changed => {
							message.channel
								.send(changed? `Bot role updated!` : `${args[0]} is already the bot role!`)
								.then(console.log(`Sent message: ${message.content}`))
								.catch(console.error);
						}, err => {
							throw err;
						});
					}

					break;

				case 'sm':
				case 'sendmessage':
					if(args.length < 2 || args[0].replace(/\D/g,'').length < 18){
						message.channel
							.send(`Command format is:\n\t${prefixes[message.guild.id]}${cmd} *<channel> <message>*`)
							.then(console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					} else {
						message.guild.channels.find(channel => (
							channel.id == args[0].replace(/\D/g,'')
						))
						.send(args.slice(1).join(' '))
						.then(console.log(`Sent message: ${message.content}`))
						.catch(console.error);

						if(channels[message.guild.id] !== undefined && channels[message.guild.id][0] !== undefined){
							message.guild.channels.get(channels[message.guild.id][0])
								.send(`Message sent to ${message.guild.channels.find(channel => (
									channel.id == args[0].replace(/\D/g,'')
								)).name}`)
								.then(console.log(`Sent message: ${message.content}`))
								.catch(console.error);
						}
					}

					break;

				case 'pr':
				case 'postrole':
					if(args.length < 2 || args[0].replace(/\D/g,'').length < 18){
						message.channel
							.send(`Command format is:\n\t${prefixes[message.guild.id]}${cmd} *<role> <description>*`)
							.then(console.log(`Sent message: ${message.content}`))
							.catch(console.error);
					} else {
						const color = message.guild.roles.find(role => (
							role.id === `${args[0].replace(/\D/g, '')}`
						)).color.toString(16);

						if(channels[message.guild.id] !== undefined && channels[message.guild.id][2] !== undefined){
							message.guild.channels.get(channels[message.guild.id][2])
								.send(new Discord.RichEmbed()
									.setColor(`#${color}`)
									.addField('Role name', args[0])
									.addField('Description', args.slice(1).join(' '))
									.setImage(message.attachments.size == 0? '' : message.attachments.values().next().value.url)
								).then(message => {
									message.react('✅')
										.then(r => {
											message.react('❌');
										})
										.catch(console.error);

									watchRoleReact(message.guild, message, args[0].replace(/\D/g, ''));
								}, err => {
									throw err;
								});
						}
					}
			}
		}
	}
});

watchRoleReact = (guild, message, roleId) => {
	message.awaitReactions((reaction, user) => {
		return !user.bot && (reaction.emoji.name === '✅' || reaction.emoji.name === '❌');
	}, { max: 1 }).then(collected => {
		guild.fetchMember(collected.first().users.last()).then(user => {
			role = guild.roles.find(role => (
				role.id === roleId
			));

			if(collected.first().emoji.name === '✅'){
				user.addRole(role)
					.then(console.log(`Added ${role.name} to ${user.user.username}`))
					.catch(console.error);
			} else {
				user.removeRole(role)
					.then(console.log(`Removed ${role.name} from ${user.user.username}`))
					.catch(console.error);
			}
		}, err => {
			throw err;
		});

		collected.first().remove(collected.first().users.last());
		watchRoleReact(guild, message, roleId);
	}).catch(console.error);
}

client.login(process.env.BOT_TOKEN);