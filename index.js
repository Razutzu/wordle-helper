import { Client, GatewayIntentBits } from "discord.js";

import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

class ExtendedClient extends Client {
	constructor(options) {
		super(options);
	}
	log(color, tag, msg) {
		return console.log(`${chalk.blue(`[ ${new Date().toLocaleTimeString()} ]`)} ${chalk[color](`[${tag}]`)} ${msg}`);
	}
	err(err) {
		return this.log("red", "  ERROR  ", err.stack || err);
	}
	warn(warn) {
		return this.log("red", " WARNING ", warn);
	}
	success(msg) {
		return this.log("green", " SUCCESS ", msg);
	}
	info(info) {
		return this.log("blue", "  INFO.  ", info);
	}
}

const client = new ExtendedClient({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages],
});

process.on("uncaughtException", (err) => client.err(err));

export default client;

import { events } from "./Handlers/events.js";
events();

client.login(process.env.TOKEN);
