const { MessageActionRow, MessageButton } = require('discord.js');
const EventEmitter = require('node:events');

/**
 * Represents an action row containing buttons
 */
class ButtonPackage {

}

class EasyButtons extends EventEmitter {
	constructor(client) {
		super();
		this.client = client;
	}
}

/**
 * A MessageButton but inside of an event emitter
 */
class Button extends EasyButtons {
	constructor({ label = null, style = 'PRIMARY', emoji = null, disabled = false }) {
		super();
		const buttonId = Math.random().toString();

		const button = new MessageButton().setCustomId(buttonId);
		if (emoji != null) {
			button.setEmoji(emoji);
		}

		button.style = style;
		button.disabled = disabled;
		button.label = label;

		this.buttonData = button;

		this.client.on('interactionCreate', interaction => {
			if (!interaction.isButton()) return;
			if (interaction.customId == this.buttonData.customId) {
				this.emit('click', interaction);
			}
		});

		return this;
	}
}

module.exports = EasyButtons;
module.exports.Button = Button;
module.exports.ButtonPackage = ButtonPackage;