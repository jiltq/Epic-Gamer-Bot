module.exports = {
	randomNumber(min, max) {
		return Math.floor((Math.random() * max) + min);
	},
	async getMemberFromMention(mention, guild) {
		if (!mention) return;

		if (mention.startsWith('<@') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);

			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}

			return await guild.members.cache.get(mention);
		}
	},
	random(array) {
		if (!array || array.length < 1) return null;
		return array[Math.floor(Math.random() * array.length)];
	},
	randomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min);
	},
	randomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	},
	/**
	 * Get a random element from an array
	 * @param {Array} array Desired array
	 * @returns A random element
	 */
	randomFromArray(array) {
		return array[Math.floor(Math.random() * array.length)];
	},
	randomFromObject(object) {
		const keys = Object.keys(object);
		return object[this.randomFromArray(keys)];
	},
	removeDupes(array) {
		return [...new Set(array)];
	},
	shuffle(array) {
		let currentIndex = array.length, randomIndex;

		while (currentIndex != 0) {

			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]];
		}

		return array;
	},
	clamp(number, min, max) {
		return number >= min ? (number <= max ? number : max) : min;
	},
	sumOfArray(array) {
		return array.reduce((prev, current) => prev + current);
	},
	getFavicon(url) {
		return `https://www.google.com/s2/favicons?domain_url=${url}`;
	},
	trimStringPreserveWords(input, max) {
		const words = input.split(' ');
		let sum = 0;
		const validWords = [];
		for (const word of words) {
			if (sum + word.length <= max) validWords.push(word);
			sum += word.length;
		}
		return validWords.join(' ');
	},
};
