import { readdirSync } from "fs";

import client from "../index.js";

export default async () => {
	const commandsArr = [];

	const commands = readdirSync("./Interactions/Commands");
	for (const file of commands) {
		const command = await import(`../Interactions/Commands/${file}`);
		commandsArr.push(command.default.data);
	}

	await client.application.commands
		.set(commandsArr)
		.then(() => client.success(`Commands updated`))
		.catch((err) => client.err(err));

	client.success("Loaded commands");
};
