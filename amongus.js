const { Client, GatewayIntentBits } = require('discord.js')
const play = require('play-dl');
const { EmbedBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior } = require('@discordjs/voice');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
	],
})
process.on('uncaughtException', err =>{
    console.log(err)
})
client.on('messageCreate', async message =>{
    if (message.content.includes(';')) {
        const arg = message.content.replace(/;/g, '');
        const connection = joinVoiceChannel({
			channelId: message.member.voice.channel.id,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
		});

		const [yt_info] = await play.search(arg, { limit: 1 });
		const stream = await play.stream(yt_info.url);
		const resource = createAudioResource(stream.stream, { inputType: stream.type });

		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play,
			},
		});

		player.play(resource);

		connection.subscribe(player);

		const embd = new EmbedBuilder()
			.setTitle(yt_info.title)
			.setAuthor({ name: 'now playing...' })
			.setThumbnail(yt_info.thumbnails[0].url);

		message.channel.send({ embeds: [embd] });
    }
})
client.login('NzAwNDU1NTM5NTU3MjY5NTc1.XpjMDg.jYHuLlQIu5-Vp2lVKlsZ8KhcNJw');