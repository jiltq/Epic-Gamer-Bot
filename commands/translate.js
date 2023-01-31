const translate = require('@vitalets/google-translate-api');
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('translate text to or from another language')
		.addStringOption(option =>
			option
				.setName('text')
				.setDescription('text to translate')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('to')
				.setDescription('language to translate to')
				.setRequired(false),
		)
		.addStringOption(option =>
			option
				.setName('from')
				.setDescription('language to translate from')
				.setRequired(false),
		),
	async execute(interaction) {
		await interaction.deferReply();

		const res = await translate(trim(interaction.options.getString('text'), 5000), { from: 'auto', to: 'en' });
		const embed = new Discord.MessageEmbed()
			.addField(`:flag_${res.from.language.iso}: ${translate.languages[res.from.language.iso]}`, trim(res.from.text.value || interaction.options.getString('text'), 1024), true)
			.addField(`:flag_${toISO}: ${translate.languages[toISO]}`, trim(res.text, 1024), true);
		interaction.editReply({ embeds: [embed] });
	},
};
