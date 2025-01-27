import client from "../index.js";

export default {
	name: "ready",
	once: true,
	run: async () => {
		client.success(`${client.user.username} is ready`);
	},
};
