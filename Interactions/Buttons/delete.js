import { MessageFlags } from "discord.js";

import client from "../../index.js";

export default {
	run: async (interaction) => {
		const session = client.sessions.get(interaction.user.id);
		if (!session) return await interaction.reply({ content: "You don't have an active session", flags: MessageFlags.Ephemeral }).catch((err) => client.err(err));

		if (session.done) return interaction.reply({ content: "Your session has ended", flags: MessageFlags.Ephemeral }).catch((err) => client.err(err));

		if (session.typingPosition == 0)
			return interaction.reply({ content: "You don't have any characters left to delete", flags: MessageFlags.Ephemeral }).catch((err) => client.err(err));

		session.delete(interaction);

		await interaction.deferUpdate();
	},
};
