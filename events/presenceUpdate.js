return

const Discord = require('discord.js');
const logHelper = require('../logHelper.js');
const chalk = require('chalk');

const chatChannel = '816126601184018472';
const egId = '696079746697527376';

const descriptionProperties = [
	'details',
	'platform',
	'state',
];

const typeReformat = {
	PLAYING: 'playing',
	STREAMING: 'streaming',
	LISTENING: 'listening to',
	WATCHING: 'watching',
	CUSTOM: '',
	COMPETING: 'competing in',
};

module.exports = {
	name: 'presenceUpdate',
	async execute(oldPresence, newPresence) {
		if (newPresence.user.id != '695662672687005737' || newPresence.member.guild.id != egId) return;

		const cancelIcon = new Discord.MessageAttachment(`${process.cwd()}/assets/cancel_icon.png`);

		const statusIcons = {
			'online': new Discord.MessageAttachment(`${process.cwd()}/assets/enter_icon.png`, 'online_icon.png'),
			'idle': new Discord.MessageAttachment(`${process.cwd()}/assets/idle_icon.png`),
			'offline': new Discord.MessageAttachment(`${process.cwd()}/assets/leave_icon.png`, 'offline_icon.png'),
			'dnd': new Discord.MessageAttachment(`${process.cwd()}/assets/dnd_icon.png`),
		};
		const statusColors = {
			'online': '#3ba55d',
			'idle': '#faa81a',
			'offline': '#747f8d',
			'dnd': '#ed4245',
			'custom': '#9b59b6',
		};

		if (!oldPresence) {
			oldPresence = {
				activities: [],
				status: 'offline',
			};
		}

		const newActivity = newPresence.activities.find(activity => !oldPresence.activities.find(activity2 => activity2.name == activity.name));
		const oldActivity = oldPresence.activities.find(activity => !newPresence.activities.find(activity2 => activity2.name == activity.name));

		let update;
		const files = [];
		let row;

		let isImportant = false;
		let statusUpdate = false;
		let customStatus = false;

		const embed = new Discord.MessageEmbed()
			.setColor('#2f3136');

		if (newPresence.status != oldPresence.status) {
			update = `is now ${chalk.hex(statusColors[newPresence.status])(newPresence.status)}`;
			files.push(statusIcons[newPresence.status]);
			embed.setThumbnail(`attachment://${newPresence.status}_icon.png`);
			embed.setColor(statusColors[newPresence.status]);

			if ((newPresence.status != 'offline' && oldPresence.status == 'offline') || (newPresence.status == 'offline' && oldPresence.status != 'offline')) {
				isImportant = true;
			}
			/*
			if (newPresence.status != 'offline' && oldPresence.status == 'offline') {
				userData.users[newPresence.user.id].statusUpdates.push({ time: Date.now(), update: 'online' });
			}
			else if (newPresence.status == 'offline' && oldPresence.status != 'offline') {
				userData.users[newPresence.user.id].statusUpdates.push({ time: Date.now(), update: 'offline' });
			}
			*/
		}
		else if (newActivity) {
			isImportant = true;
			if (newActivity.type == 'CUSTOM') {
				customStatus = true;
				logHelper.logAdvanced(module.exports, `${chalk.hex(newPresence.member.displayHexColor)(newPresence.user.username)} ${chalk.hex(logHelper.themes.default)('is now')} ${chalk.hex(statusColors.custom)(`"${newActivity.state}"`)}`);
			}
			else {
				update = `is now ${typeReformat[newActivity.type]} ${newActivity.name}`;
			}
			if (newActivity.assets) {
				embed.setThumbnail(newActivity.assets.largeImageURL());
			}
			for (let i = 0; i < descriptionProperties.length; i++) {
				if (newActivity[descriptionProperties[i]]) {
					embed.addField(descriptionProperties[i], newActivity[descriptionProperties[i]]);
				}
			}
		}
		else if (oldActivity) {
			update = `is no longer ${typeReformat[oldActivity.type]} ${oldActivity.name}`;
			files.push(cancelIcon);
			embed.setThumbnail('attachment://cancel_icon.png');
		}
		else if (newPresence.activities.length == 0 && oldPresence.activities.length != 0) {
			update = 'is no longer doing anything';
			files.push(cancelIcon);
			embed.setThumbnail('attachment://cancel_icon.png');
		}
		if (!update) return;
		if (!statusUpdate || customStatus) {
			logHelper.log(module.exports, 'default', `${chalk.hex(newPresence.member.displayHexColor != '#000000' ? newPresence.member.displayHexColor : '#FFFFFF')(newPresence.user.username)} ${update}`);
		}

		embed
			.setAuthor('👑 status update')
			.setTitle(`${newPresence.user.username} ${update}`)
			.setColor('#FFD700');
		newPresence.client.channels.fetch('816126601184018472').then(async channel =>{
			await channel.send({ embeds: [embed], files: files });
		});
	},
};