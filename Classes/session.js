import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageFlags, underline } from "discord.js";

import wordsStart from "../wordsStart.json" with { type : "json" };
import words from "../words.json" with { type: "json" };

import client from "../index.js";

class Session {
	constructor(interaction) {
		this.id = interaction.user.id;

		this.filtersApplied = [];
		this.words = words;

		this.done = false;
		this.status = { tryNow: this.wordToCharacters(wordsStart[Math.floor(Math.random() * wordsStart.length)]), lastTry: ["bkb", "bkb", "bkb", "bkb", "bkb"] };

		this.typingPosition = 0;
		this.try = 1;

		this.message = null;
		this.messageData = {
			flags: MessageFlags.Ephemeral,
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Yellow)
					.setAuthor({ name: "Wordle helper" })
					.setDescription('Enter the "Try now" word in your wordle\n\nUse the buttons to mark the letters and use the check mark to finish')
					.setFields(this.statusToFields()),
			],
			components: [
				new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`done_${interaction.user.id}`).setStyle(ButtonStyle.Success).setEmoji("✅")),
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`send_${interaction.user.id}`).setStyle(ButtonStyle.Primary).setEmoji("➡️"),
					new ButtonBuilder().setCustomId(`type_${interaction.user.id}_gn`).setStyle(ButtonStyle.Secondary).setEmoji(process.env.greenBoxEmojiId),
					new ButtonBuilder().setCustomId(`type_${interaction.user.id}_yw`).setStyle(ButtonStyle.Secondary).setEmoji(process.env.yellowBoxEmojiId),
					new ButtonBuilder().setCustomId(`type_${interaction.user.id}_gy`).setStyle(ButtonStyle.Secondary).setEmoji(process.env.grayBoxEmojiId),
					new ButtonBuilder().setCustomId(`delete_${interaction.user.id}`).setStyle(ButtonStyle.Danger).setEmoji("⬅️")
				),
			],
		};

		this.updateMessage(interaction, true);
	}
	async updateMessage(interaction, newMessage) {
		if (newMessage || !this.message)
			return await interaction
				.reply(this.messageData)
				.then((msg) => (this.message = msg.interaction))
				.catch((err) => client.err(err));
		return await this.message.editReply(this.messageData).catch(async (err) => {
			if (interaction) await this.updateMessage(interaction, true);
			client.err(err);
		});
	}
	async type(interaction, button) {
		this.status.tryNow[this.typingPosition] = `${this.status.tryNow[this.typingPosition][0]}${button}`;

		this.typingPosition++;

		this.messageData.embeds[0].setFields(this.statusToFields());

		return await this.updateMessage(interaction, false);
	}
	async delete(interaction) {
		this.typingPosition--;

		this.status.tryNow[this.typingPosition] = `${this.status.tryNow[this.typingPosition][0]}gy`;

		this.messageData.embeds[0].setFields(this.statusToFields());

		return await this.updateMessage(interaction, false);
	}
	async next(interaction) {
		this.typingPosition = 0;
		this.status.lastTry = this.status.tryNow;

		this.filterWords();
		if (this.words.length == 0 || this.try == 6) return await this.fail(interaction);

		this.status.tryNow = this.wordToCharacters(this.words[Math.floor(Math.random() * this.words.length)]);
		this.try++;

		this.messageData.embeds[0].setFields(this.statusToFields());

		return await this.updateMessage(interaction, false);
	}
	async win(interaction) {
		if (this.status.lastTry != this.status.tryNow) this.status.lastTry = this.status.tryNow;

		this.status.lastTry = this.turnCharactersGreen(this.status.lastTry);

		this.messageData.embeds[0].setColor(Colors.Green).setDescription("I'm glad I was able to help you with this one").setFields(this.statusToFields(true));

		return await this.end(interaction);
	}
	async fail(interaction) {
		this.messageData.embeds[0].setColor(Colors.Red).setDescription("I'm sorry, but I am not able to help you with this one").setFields(this.statusToFields(true));

		return await this.end(interaction);
	}
	async end(interaction) {
		this.done = true;
		this.messageData.components = [];
		client.sessions.delete(this.id);

		return await this.updateMessage(interaction, false);
	}
	filterWords() {
		const guess = this.status.lastTry;

		for (let i = 0; i < guess.length; i++) {
			const char = guess[i][0];
			const status = guess[i].slice(1);

			if (this.filtersApplied.includes(`${i}${char}${status}`)) continue;

			switch (status) {
				case "gn":
					this.words = this.words.filter((w) => w[i] == char);
					break;
				case "yw":
					this.words = this.words.filter((w) =>
						guess.includes(char + "gn") ? (w) => w[i] != char && w[guess.indexOf(char + "gn") != char && w.includes(char)] : w[i] != char && w.includes(char)
					);
					break;
				case "gy":
					this.words = this.words.filter((w) => (guess.includes(char + "gn") || guess.includes(char + "yw") ? w[i] != char : !w.includes(char)));
					break;
			}

			this.filtersApplied.push(`${i}${char}${status}`);
		}

		return true;
	}
	turnCharactersGreen(characters) {
		for (let i = 0; i < characters.length; i++) characters[i] = `${characters[i][0]}gn`;

		return characters;
	}
	wordToCharacters(word) {
		let content = [];
		for (let i = 0; i < word.length; i++) content.push(`${word[i]}gy`);
		return content;
	}
	charactersToString(characters, tryNow) {
		let content = "";

		if (tryNow)
			for (let i = 0; i < characters.length; i++)
				content = i == this.typingPosition ? content.concat(`|${client.letters.get(characters[i])}| `) : content.concat(`${client.letters.get(characters[i])} `);
		else for (let i = 0; i < characters.length; i++) content = content.concat(`${client.letters.get(characters[i])} `);

		return content;
	}
	statusToFields(finish) {
		if (finish)
			return [
				{ name: "Tries", value: `${this.try}` },
				{ name: "Last try:", value: this.charactersToString(this.status.lastTry) },
			];

		return [
			{ name: "Tries", value: `${this.try}` },
			{ name: "Last try:", value: this.charactersToString(this.status.lastTry) },
			{ name: "Try now:", value: this.charactersToString(this.status.tryNow, true) },
		];
	}
}

export default Session;
