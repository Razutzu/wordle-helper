import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageFlags } from "discord.js";

import wordsStart from "../wordsStart.json" with { type : "json" };

import client from "../index.js";

class Session {
	constructor(interaction) {
		this.id = interaction.user.id;

		this.status = { tryNow: this.wordToCharacters(wordsStart[Math.floor(Math.random() * wordsStart.length)]), lastTry: ["bkb", "bkb", "bkb", "bkb", "bkb"] };

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
                new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`done_${interaction.user.id}`).setStyle(ButtonStyle.Success).setEmoji("✅"),
					new ButtonBuilder().setCustomId(`delete_${interaction.user.id}`).setStyle(ButtonStyle.Danger).setEmoji("⬅️"),
				),
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`green_${interaction.user.id}`).setStyle(ButtonStyle.Secondary).setEmoji(process.env.greenBoxEmojiId),
					new ButtonBuilder().setCustomId(`yellow_${interaction.user.id}`).setStyle(ButtonStyle.Secondary).setEmoji(process.env.yellowBoxEmojiId),
					new ButtonBuilder().setCustomId(`gray_${interaction.user.id}`).setStyle(ButtonStyle.Secondary).setEmoji(process.env.grayBoxEmojiId)
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
	wordToCharacters(word) {
		let content = [];
		for (let i = 0; i < word.length; i++) content.push(`${word[i]}gy`);
		return content;
	}
	charactersToString(characters) {
		let content = "";
		for (let i = 0; i < characters.length; i++) content = content.concat(`${client.letters.get(characters[i])} `);
		return content;
	}
	statusToFields() {
		return [
			{ name: "Last try:", value: this.charactersToString(this.status.lastTry) },
			{ name: "Try now:", value: this.charactersToString(this.status.tryNow) },
		];
	}
}

export default Session;
