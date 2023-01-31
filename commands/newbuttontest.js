const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { Button, ButtonBundle, ButtonPackage, ButtonStyle } = require('discord.js-better-buttons');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('newbuttontest')
		.setDescription('testing'),
	async execute(interaction) {
		const button = new Button({ label: 'hello', style: ButtonStyle.secondary });
		console.log(button);

		const bundle = new ButtonBundle([ button ]);

		const package = new ButtonPackage([ bundle ], interaction.client);

		button.on('click', async i =>{
			console.log('A button was clicked!');
		});

		interaction.reply({ content: 'hi', components: package.format() });
	},
};
