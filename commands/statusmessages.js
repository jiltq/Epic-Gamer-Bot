const { SlashCommandBuilder } = require('@discordjs/builders');
const egbFirestore = require('../egbFirestore.js');
const firestore = new egbFirestore();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addstatusmessage')
		.setDescription('give egb something to do..')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('type of status message')
				.setRequired(true)
				.addChoice('🎮 playing', 'PLAYING')
				.addChoice('🎬 watching', 'WATCHING')
				.addChoice('🎶 listening to', 'LISTENING')
				.addChoice('⚔️ competing in', 'COMPETING')
				.addChoice('🖥️ streaming', 'STREAMING'))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('the status message')
				.setRequired(true)),
	async execute(interaction) {
		const type = interaction.options.getString('type');
		const message = interaction.options.getString('message');
		await firestore.addDocument('status_messages', {
			activity: message,
			type: type,
		});
		await interaction.reply({ content: '**successfully added your status message!**' });
	},
};
