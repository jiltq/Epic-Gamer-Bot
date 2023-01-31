const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const got = require('got');

const key = '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';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gpt3')
		.setDescription('utilize the power of AI to do the dumbest shit you could ever imagine')
		.addStringOption(option =>
			option.setName('prompt')
				.setDescription('what do you want to say to the AI?')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const url = 'https://api.openai.com/v1/engines/text-davinci-002/completions';
		const prompt = interaction.options.getString('prompt');
		const params = {
			prompt,
			max_tokens: 256,
			temperature: 0.7
		};
		const headers = { 'Authorization': `Bearer ${key}` };

		const response = await got.post(url, { json: params, headers: headers }).json();
		const output = response.choices[0].text;

		const embed = new Discord.MessageEmbed()
			.setAuthor({ name: 'GPT-3', iconURL: 'https://static-00.iconduck.com/assets.00/openai-icon-505x512-pr6amibw.png' })
			.setTitle(`> ${prompt}`)
			.setDescription(output);

		interaction.editReply({ embeds: [embed] });
	},
};
