import { MessageFlags } from "discord.js";

import client from "../../index.js";

export default {
	run: async (interaction) => {
		const session = client.sessions.get(interaction.user.id);
		if (!session) return await interaction.reply({ content: "You don't have an active session", flags: MessageFlags.Ephemeral }).catch((err) => client.err(err));

		if (session.done) return interaction.reply({ content: "Your session has ended", flags: MessageFlags.Ephemeral }).catch((err) => client.err(err));

		if (session.typingPosition > 4)
			return interaction.reply({ content: "You can now either **send** or **delete**", flags: MessageFlags.Ephemeral }).catch((err) => client.err(err));

		const color = interaction.customId.split("_").at(-1);

		session.type(interaction, color);

		await interaction.deferUpdate();
	},
};
