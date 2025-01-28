import client from "../index.js";

let chars = "qwertyuiopasdfghjklzxcvbnm";
let colors = ["gn", "yw", "gy"];
export default async () => {
	let emoji;

	for (let i = 0; i < chars.length; i++) {
		for (let j = 0; j < 3; j++) {
			emoji = client.emojis.cache.find((e) => e.name == `${chars[i]}${colors[j]}`);
			client.letters.set(emoji.name, emoji.toString());
		}
	}

	client.letters.set("gb", client.emojis.cache.get("1333830822976950302").toString());

	client.success("Loaded emojis");
};
