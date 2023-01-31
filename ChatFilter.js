// low = 33.33%
// medium = 66.66%
// high = 100%
const badwords = {
	low: [],
	medium: [],
	high: ['cunt', 'fuck', 'shit'],
};

const variations = {
	'3': 'e',
	'8': 'b',
	'!': 'i',
	'1': 'i',
	'0': 'o',
	'7': 't',
	'5': 's',
	'(': 'l',
	')': 'l',
};

class ChatFilter {
	constructor(lWeight, mWeight, hWeight) {
		this.lWeight = lWeight;
		this.mWeight = mWeight;
		this.hWeight = hWeight;
	}
	scanWord(word) {
		const lower = word.toLowerCase();
		let specialReplaced = lower;
		for (const key in variations) {
			const re = new RegExp(key, 'gi');
			specialReplaced = specialReplaced.replace(re, variations[key]);
		}
		console.log(specialReplaced);
		for (const severity in badwords) {
			for (const badword of badwords[severity]) {
				console.log(badword);
			}
		}
	}
	scanMessage(msg) {
		const words = msg.split(' ');
		for (const word of words) {

		}
	}
}
module.exports = ChatFilter;