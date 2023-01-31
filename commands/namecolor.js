const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColors } = require('../Decor.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('namecolor')
		.setDescription('change the color of your name!')
		.addStringOption(option =>
			option
				.setName('color')
				.setDescription('color to choose')
				.setRequired(true),
		),
	async execute(interaction) {
	},
};
