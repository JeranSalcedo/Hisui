const Discord = require('discord.js');
const { Client } = require('pg');
const auth = require('./auth.json');

const GuildController = require('./controllers/guildController');
const ChannelController = require('./controllers/channelController');

const guildController = new GuildController();
const channelController = new ChannelController();

const connection = new Client({
	connectionString: auth.db,
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

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.guilds.forEach(guild => {
		guildController.getPrefix(guild.id).then(data => {
			prefixes[guild.id] = data;
		}, err => {
			throw err;
		});
	});
});

client.on('message', message => {
	if(message.channel.type === 'dm'){
		if(!message.author.bot && message.content.startsWith('!h ')){
			elements = message.content.split(/\s+/).slice(1);

			cmd = elements[0];
			args = elements.slice(1);

			switch(cmd.toLowerCase()){
				case 'sm':
				case 'sendmessage':
					if(args.length < 3 || args[0].replace(/\D/g,'').length < 18 || args[1].replace(/\D/g,'').length < 18){
						message.channel
							.send(`Command format is:\n\t!k ${cmd} *<server> <channel> <message>*`)
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
		if(!message.author.bot && message.member.hasPermission('ADMINISTRATOR') && message.content.startsWith(prefixes[message.guild.id])){
			elements = message.content.split(/\s+/).slice(1).map(element => (
				element.toLowerCase()
			));

			cmd = elements[0];
			args = elements.slice(1);

			switch(cmd){
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
			}
		}
	}
})

client.login(auth.token);