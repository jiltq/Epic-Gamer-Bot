const { MessageActionRow, MessageButton } = require('discord.js');
const EventEmitter = require('node:events');

/**
 * An error thrown when a button package's size is invalid
 */
class ButtonPackageSizeError extends Error {
	constructor(message) {
		super(message);
		this.name = 'PackageSizeError';
	}
}

class ezButton extends EventEmitter {
	constructor(buttonData) {
		super();
		this.buttonData = buttonData;
		this.buttonPackageId = null;
	}
	/**
     * Updates a property of the button
     * @param {*} property The name of the property
     * @param {*} value The desired value
     * @param {MessageActionRow} package The package containing the button
     */
	updateData(property, value, buttonmaker) {
		this.buttonData[property] = value;
		console.log(buttonmaker.buttonPackages[this.buttonPackageId]);
		// const target = buttonPackage.components.find(button => button.customId == this.buttonData.customId);
		// target[property] = value;
	}
}

/**
 * A class that makes the creation and use of buttons easier
 */
class ezButtonMaker extends EventEmitter {
	constructor(client) {
		super();
		this.client = client;
		this.buttonId = null;
		this.buttons = [];

		this.buttonPackages = {};
		this.buttons2 = {};
	}

	/**
     * Creates a new button
     * @param {String} label Label of the button
     * @param {MessageButtonStyle} style Style of the button
     * @param {APIPartialEmoji} emoji Emoji of the button
     * @returns {ezButton} New button
     */
	createButton({ label = null, style = 'PRIMARY', emoji = null, disabled = false }) {
		if (label == null && emoji == null) throw new Error('Button must have either an emoji, a label, or both');
		const buttonId = Math.random().toString();

		const button = new MessageButton().setCustomId(buttonId);
		if (emoji != null) {
			button.setEmoji(emoji);
		}

		button.style = style;
		button.disabled = disabled;
		button.label = label;

		const buttonMod = new ezButton(button);

		this.buttons.push(buttonMod);
		this.buttons2[buttonId] = buttonMod;

		this.client.on('interactionCreate', interaction => {
			if (!interaction.isButton()) return;
			if (interaction.customId == buttonMod.buttonData.customId) {
				buttonMod.emit('click', interaction);
				this.emit('click', interaction);
			}
		});

		return buttonMod;
	}

	/**
     * Creates a package of buttons
     * @param {ezButton[]} buttons Buttons to package
     * @throws {ButtonPackageSizeError} A package may only contain 1 - 5 buttons
     * @returns {MessageActionRow} New button package
     */
	createButtonPackage(buttons = []) {
		if (buttons.length < 1) throw new ButtonPackageSizeError('A package must contain at least one button');
		if (buttons.length > 5) throw new ButtonPackageSizeError('A package may only contain 5 buttons');
		const id = Math.random().toString();
		for (const button of buttons) button.buttonPackageId = id;
		const modButtons = buttons.map(button => button.buttonData);
		const buttonPackage = new MessageActionRow().addComponents(...modButtons);
		this.buttonPackages[id] = buttonPackage;
		return buttonPackage;
	}

	/**
     * Update the contents of a button package
     * @param {MessageActionRow} buttonPackage The button package
     * @param {ezButton[]} buttons Buttons
     */
	updateButtonPackage(buttonPackage, buttons) {
		buttonPackage.setComponents(...buttons);
	}

	/**
     * Update a property of all buttons
     * @param {.} property The name of the property
     * @param {.} value The value to set the property to
     */
	updateAllButtons(property, value) {
		for (const button of this.buttons) {
			button.updateData(property, value);
		}
	}

	updateButton(button, options) {
		const key = Object.keys(options)[0];const value = Object.values(options)[0];
		button.buttonData = { ...button.buttonData, ...options };
		this.buttonPackages[button.buttonPackageId].components.find(_button => _button.customId == button.buttonData.customId)[key] = value;
	}

	async updateEverything(i) {
		await i.update({ components: Object.values(this.buttonPackages) });
	}
}
module.exports = ezButtonMaker;