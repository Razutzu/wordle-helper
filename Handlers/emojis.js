import client from "../index.js";

let chars = "qwertyuiopasdfghjklzxcvbnm";
let colors = ["gn", "yw", "gy"];
export default async () => {
	let emoji;

	for (let i = 0; i < 3; i++) {
		emoji = client.emojis.cache.find((e) => e.name == `${colors[i]}b`);
		client.letters.set(emoji.name, emoji.toString());
		for (let j = 0; j < chars.length; j++) {
			emoji = client.emojis.cache.find((e) => e.name == `${chars[j]}${colors[i]}`);
			client.letters.set(emoji.name, emoji.toString());
			console.log(`Loaded ${emoji.toString()}`);
		}
	}

	client.letters.set("bkb", client.emojis.cache.get("1333830822976950302").toString());

	client.success("Loaded emojis");
};
