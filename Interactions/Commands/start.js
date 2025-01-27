import { SlashCommandBuilder } from "discord.js";

import client from "../../index.js";

export default {
	data: new SlashCommandBuilder().setName("start").setDescription("Let me help you win today's wordle."),
	run: async (interaction) => {},
};
