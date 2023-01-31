const play = require('play-dl');
const { EmbedBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior } = require('@discordjs/voice');

module.exports = {
	async execute(msg, args) {
		const connection = joinVoiceChannel({
			channelId: msg.member.voice.channel.id,
			guildId: msg.guild.id,
			adapterCreator: msg.guild.voiceAdapterCreator,
		});

		const [yt_info] = await play.search(args.join(','), { limit: 1 });
		const stream = await play.stream(yt_info.url);
		const resource = createAudioResource(stream.stream, { inputType: stream.type });

		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play,
			},
		});

		player.play(resource);

		connection.subscribe(player);

		const embed = new EmbedBuilder()
	.setAuthor({ name: 'now playing' })
	.setTitle(yt_info.title)
	.setImage(yt_info.thumbnails[0].url)
	.setTimestamp();

		await msg.reply({ embeds: [embed] })


	},
};