const EventEmitter = require('events');
const { MessageActionRow, MessageButton } = require('discord.js');

class easyComponentHelper extends EventEmitter {
	constructor() {
		super();
		this.componentId = Math.random().toString();
		this.buttons = [];
		this.selectMenus = [];
	}
	async createButton(buttonOptions) {
		const componentId = this.componentId;
		const button = new MessageButton()
			.setLabel('hi')
			.setCustomId(JSON.stringify({ componentId, action: 'hello' }))
			.setStyle('PRIMARY');

		console.log(button);
	}
	async createCollector(interaction) {
		const filter = i => (i.user.id == interaction.user.id) && JSON.parse(i.customId).id == this.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 200 * 1000 });
	}
}
module.exports = easyComponentHelper;