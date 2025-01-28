import { EmbedBuilder } from "@discordjs/builders";
import client from "../index.js";
import { Colors } from "discord.js";

class Session {
	constructor(interaction) {
		this.id = interaction.user.id;

		this.messageData = {
			content: null,
			embeds: [new EmbedBuilder().setColor(Colors.Yellow).setAuthor({ name: "Wordle helper" }).setDescription("")],
		};
	}
}

export default Session;
