import { MessageFlags } from "discord.js";

import client from "../../index.js";

export default {
	run: async (interaction) => {
		const session = client.sessions.get(interaction.user.id);
		if (!session) return await interaction.reply({ content: "You don't have an active session", flags: MessageFlags.Ephemeral }).catch((err) => client.err(err));

		if (session.done) return interaction.reply({ content: "Your session has ended", flags: MessageFlags.Ephemeral }).catch((err) => client.err(err));

		if (session.typingPosition < 5)
			return interaction.reply({ content: "Set the color for all position before sending", flags: MessageFlags.Ephemeral }).catch((err) => client.err(err));

		session.next(interaction);

		await interaction.deferUpdate();
	},
};
