const utility = require('./utility.js');
// const egbFirestore = require('./egbFirestore.js');
// const firestore = new egbFirestore();
// const Canvas = require('canvas');

const egbFirestore = require('./egbFirestore.js');
const firestore = new egbFirestore();

class Status {
	constructor(client, path) {
		this.client = client;
		this.path = path;
	}
	async cycle(client, path) {
		client.user.setStatus('dnd');

		// const collection = await firestore.getDocuments('eg_icons').then(result => Object.values(result));
		setInterval(async function() {
			if (utility.random([0, 0, 0, 0, 0, 0, 0, 0, 0, 1]) == 1) {
				client.user.setPresence({ activities: [{ name: 'want to submit activities for egb? use the /addstatusmessage command!', type: 'PLAYING' }], status: 'dnd' });
			}
			else {
				const collection = await firestore.getDocuments('status_messages').then(result => Object.values(result));

				const status = utility.random(collection);

				client.user.setActivity(status.activity, { type: status.type });
			}
		}, 1000 * 60);
		/*
		if (client.shard.ids[0] == 1) {
			setInterval(async function() {
				const { image } = utility.random(collection);


				const canvas = Canvas.createCanvas(500, 500);
				const context = canvas.getContext('2d');

				const background = await Canvas.loadImage(image);
				context.drawImage(background, 0, 0, canvas.width, canvas.height);
				context.font = '100px sans-serif';
				context.fillStyle = '#000000';

				const measurement = context.measureText('EG');
				console.log(measurement);
				context.fillText('EG', ((canvas.width / 2) - (measurement.width / 2)), canvas.height / 2);


				const guild = await client.guilds.fetch('696079746697527376');
				await guild.setIcon(canvas.toBuffer());
			}, 1000 * 5);
		}
		*/
	}
}
module.exports = Status;