import client from "../index.js";

import originalWords from "../words.json" with { type: "json" };

let words = originalWords;
let tries = [];

export default {
	name: "messageCreate",
	once: false,
	run: async (message) => {
		if (message.author.id != "987034028043563090") return;

		if (message.content == "correct") {
			words = originalWords;
			tries = [];
			return message.reply({ content: "Great!" }).catch((err) => client.err(err));
		}

		const guess = message.content.split(" ");

		for (let i = 0; i < guess.length; i++) {
			const char = guess[i][0];
			const status = guess[i][1];

			if (tries.includes(`${i}${char}${status}`)) {
				client.info(`${i}${char}${status} found`);
				continue;
			}

			if (status == "g") words = words.filter((w) => w[i] == char);
			else if (status == "y") words = words.filter((w) => w[i] != char && w.includes(char));
			else if (status == "r") words = words.filter((w) => (guess.includes(char + "g") || guess.includes(char + "y") ? w[i] != char : !w.includes(char)));

			tries.push(`${i}${char}${status}`);
		}

		if (words.length == 0) {
			message.reply({ content: "I'm sorry, I am not able to guess this one" }).catch((err) => client.err(err));
			tries = [];
			return (words = originalWords);
		}

		message.reply({ content: `Try ${words[Math.floor(Math.random() * words.length)]}` });
	},
};
