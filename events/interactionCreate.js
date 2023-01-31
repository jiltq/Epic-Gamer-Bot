const fs = require('fs');
const Discord = require('discord.js');
const logHelper = require('../logHelper.js');
const { embedColors } = require('../Decor.js');

const { CommandManager } = require('../commandManagers.js');

const archiveChannel = '892599884107087892';

const commandManager = new CommandManager();
const commands = commandManager.registerCommandModules(`${process.cwd()}/commands`);

const errorIcon = new Discord.MessageAttachment(`${process.cwd()}/assets/error_icon.png`);

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		if (!interaction.isCommand() && !interaction.isMessageContextMenu()) return;
		const command = commands.get(interaction.commandName);

		if (!command) return;
		try {
			await commandManager.executeCommand(command, interaction);
		}
		catch (error) {
			logHelper.log(module.exports, 'error', `there was an unexpected error while executing command "${interaction.commandName}"`);
			logHelper.log(module.exports, 'error', error.toString());
			console.log(error);
			const errorEmbed = new Discord.MessageEmbed()
				.setAuthor({ name: 'command error', iconURL: 'attachment://error_icon.png' })
				.setTitle(error.toString())
				.setFooter('an error report has been sent to jiltq')
				.setColor(embedColors.error);
			if (interaction.replied || interaction.deferred) {
				await interaction.editReply({ embeds: [errorEmbed], files: [errorIcon], ephemeral: true });
			}
			else {
				await interaction.reply({ embeds: [errorEmbed], files: [errorIcon], ephemeral: true });
			}
		}
	},
};