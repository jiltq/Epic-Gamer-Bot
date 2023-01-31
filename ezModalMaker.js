const { MessageActionRow, Modal, TextInputComponent } = require('discord.js');
const EventEmitter = require('node:events');

/**
 * An event emitter containing a modal
 */
class ezModal extends EventEmitter {
	/**
     * @param {Modal} modal The modal
     */
	constructor(modal) {
		super();
		this.modal = modal;
	}
}

/**
 * A class that makes the creation and use of modals easier
 */
class ezModalMaker {
	/**
     * @param {Client} client Bot client
     */
	constructor(client) {
		this.client = client;
		this.modalId = null;
		this.inputIds = {};
		this.modal = null;
	}

	/**
     * Creates a new modal
     * @param {String} title Title of the modal
     * @param {MessageActionRow[]} inputs Inputs for the modal (see {@link createInput})
     * @returns {ezModal} The new modal
     */
	createModal(title, inputs) {
		this.modalId = Math.random().toString();

		const modal = new Modal()
			.setCustomId(this.modalId)
			.setTitle(title);

		modal.addComponents(...inputs);

		const modalMod = new ezModal(modal);
		this.modal = modalMod;

		this.client.on('interactionCreate', interaction => {
			if (!interaction.isModalSubmit()) return;
			if (interaction.customId == this.modalId) {
				const values = {};
				for (const label in this.inputIds) {
					values[label] = interaction.fields.getTextInputValue(this.inputIds[label]);
				}
				modalMod.emit('submission', values);
			}
		});

		return modalMod;
	}

	/**
     * Creates a message action row
     * @param {String} label The label of the text input component
     * @param {String} style The style of the text input component, either "SHORT" or "PARAGRAPH"
     * @returns {MessageActionRow} The new message action row
     */
	createInput(label, style) {
		const inputId = Math.random().toString();
		this.inputIds[label] = inputId;

		const inputComponent = new TextInputComponent()
			.setCustomId(inputId)
			.setLabel(label)
			.setStyle(style);
		return new MessageActionRow().addComponents(inputComponent);
	}

	/**
     * Shows modal to the user
     * @param {CommandInteraction} interaction The interaction
     * @param {ezModal} modal The modal
     */
	async showModal(interaction, modal) {
		await interaction.showModal(modal.modal);
	}
}
module.exports = ezModalMaker;