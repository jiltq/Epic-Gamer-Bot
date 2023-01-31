const { SlashCommandBuilder } = require('@discordjs/builders');
const play = require('play-dl');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	NoSubscriberBehavior,
} = require('@discordjs/voice');

const links = {
	'😤 boi': 'https://www.youtube.com/watch?v=rLhzbjaaOPA',
	'🎺 doot': 'https://www.youtube.com/watch?v=eVrYbKBrI7o',
	'😂 laugh': 'https://www.youtube.com/watch?v=iYVO5bUFww0',
	'📯 horn': 'https://www.youtube.com/watch?v=PRc2vx4xTVM',
	'🧱 our table': 'https://www.youtube.com/watch?v=IHY7Lq4nwAg',
	'🐶 ben': 'https://www.youtube.com/watch?v=6hrdB0omZjs',
	'✨ regen': 'https://www.youtube.com/watch?v=Mg0iUgWVH_o',
	'💨 fart': 'https://www.youtube.com/watch?v=Qi1KebO4bzc',
	'🍔 hamburger': 'https://www.youtube.com/watch?v=kXsk8CkZUFA',
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sfx')
		.setDescription('plays a sound effect')
		.addStringOption(option =>{
			option.setName('sound')
				.setDescription('sound effect to play')
				.setRequired(true);
			for (const [key, value] of Object.entries(links)) {
				option.addChoice(key, value);
			}
			return option;
		}),
	async execute(interaction) {
		await interaction.deferReply();
		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channelId,
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		const stream = await play.stream(interaction.options.getString('sound'));
		const resource = createAudioResource(stream.stream, {
			inputType: stream.type,
			inlineVolume: true,
		});

		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play,
			},
		});

		player.play(resource);

		connection.subscribe(player);
		player.on(AudioPlayerStatus.Idle, async () =>{
			connection.destroy();
			await interaction.deleteReply();
		});
	},
};
