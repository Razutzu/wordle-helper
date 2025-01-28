import client from "../index.js";

import commands from "../Handlers/commands.js";
import emojis from "../Handlers/emojis.js";

export default {
	name: "ready",
	once: true,
	run: async () => {
		await commands();
		await emojis();

		client.success(`${client.user.username} is ready`);
	},
};
