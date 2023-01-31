const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Web = require('../Web.js');
const { getFavicon } = require('../utility.js');
const axios = require('axios');
const cheerio = require('cheerio');

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

async function fetchData(url) {
	console.log('Crawling data...');
	// make http call to url
	const response = await axios(url).catch((err) => console.log(err));

	if(response.status !== 200) {
		console.log('Error occurred while fetching data');
		return;
	}
	return response;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scrape')
		.setDescription('scrape a website')
		.addStringOption(option =>
			option.setName('website')
				.setDescription('website to scrape')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();

		const res = await axios(interaction.options.getString('website'));
		const html = res.data;
		console.log(html);
		const $ = cheerio.load(html);
		console.log(($('h1')).text());
		console.log(($('h2')));
		const h2 = $('h2');
		const p = $('p');
		let desc = '';

		const embed = new Discord.MessageEmbed()
			.setTitle(($('title')).text());

		p.each((index, element) => {
			console.log($(element).text());
			desc = `${desc}\n\n${$(element).text()}`;
		});

		embed.setDescription(trim(desc, 2048));

		interaction.editReply({ embeds: [embed] });
	},
};
