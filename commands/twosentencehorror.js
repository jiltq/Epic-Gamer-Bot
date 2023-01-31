const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const got = require('got');

const { embedColors, getIconAttachment } = require('../Decor.js');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

const key = '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';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('twosentencehorror')
		.setDescription('creates two-sentence short horror stories from a topic input')
		.addStringOption(option =>
			option.setName('topic')
				.setDescription('the topic of the horror story')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const url = 'https://api.openai.com/v1/engines/text-davinci-002/completions';
		const prompt = `Topic: ${interaction.options.getString('topic')}\nTwo-Sentence Horror Story:`;
		const params = {
			'prompt': prompt,
			'max_tokens': 160,
		};
		const headers = {
			'Authorization': `Bearer ${key}`,
		};

		const response = await got.post(url, { json: params, headers: headers }).json();
		const output = `${prompt}${response.choices[0].text}`;
		console.log(output);

		const embed = new Discord.MessageEmbed()
			.setAuthor({ name: 'GPT-3', iconURL: 'https://static-00.iconduck.com/assets.00/openai-icon-505x512-pr6amibw.png' })
			.setTitle('two-sentence horror 👻')
			.setColor(embedColors.default)
			.setDescription(output.split(prompt)[1])
			.setFooter({ text: 'this response was made by an AI!' });

		interaction.editReply({ embeds: [embed] });
	},
};
