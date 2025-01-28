import { SlashCommandBuilder } from "discord.js";

import client from "../../index.js";
import Session from "../../Classes/session.js";

export default {
	data: new SlashCommandBuilder().setName("start").setDescription("Let me help you win today's wordle."),
	run: async (interaction) => {
		if (client.sessions.has(interaction.user.id)) return interaction.reply({ content: "You have an active session.", ephemeral: true }).catch((err) => client.err(err));

		client.sessions.set(interaction.user.id, new Session());
	},
};
