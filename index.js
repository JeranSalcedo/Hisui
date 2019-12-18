const Discord = require('discord.js');
const mysql = require('mysql');
const auth = require('./auth.json');

const GuildController = require('./controllers/guildController');
const ChannelController = require('./controllers/channelController');

const guildController = new GuildController();
const channelController = new ChannelController();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'maids'
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
	if(message.content.startsWith(prefixes[message.guild.id]) && !message.author.bot){
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
		}
	}
})

client.login(auth.token);