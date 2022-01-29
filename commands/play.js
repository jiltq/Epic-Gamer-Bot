const Discord = require('discord.js');
const yts = require('yt-search');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Voice = new (require('../voiceHelper.js'))();
const { AudioPlayerStatus } = require('@discordjs/voice');

const Voice2 = require('../Voice.js');
const Decor = require('../Decor.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('play a youtube video')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('name of video to play')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('loop')
				.setDescription('whether or not to loop the song')
				.setRequired(false))
		.addBooleanOption(option =>
			option.setName('private')
				.setDescription('if egb should make the music interface publicly visible')
				.setRequired(false)),
	async execute(interaction) {
		await interaction.deferReply();
		const musicIcon = Decor.getIconAttachment('music_icon');
		const connection = Voice2.joinVC(interaction.member.voice.channel);
		const video = (await yts(interaction.options.getString('name'))).videos[0];
		const download = await Voice2.createAudioResourceYes(video.url);
		const player = Voice2.playResource(connection, download);
		const controlPanel = Voice2.createControlPanel();

		const songEmbed = new Discord.MessageEmbed()
			.setAuthor({ name: 'egb music', iconURL: 'attachment://music_icon.png' })
			.setColor(Decor.embedColors.default)
			.setURL(video.url)
			.setTitle(video.title)
			.setDescription(`**${video.author.name}**`)
			.setImage(video.thumbnail);

		const response = await interaction.editReply({ embeds: [songEmbed], components: controlPanel, files: [musicIcon], ephemeral: false });
		Voice2.idkControlPanel(interaction, controlPanel, { response: response, player: player, resource: download });
		player.on(AudioPlayerStatus.Idle, async () => await response.delete());
	},
};