import fs from "fs";
import { PNGReader } from "./PNGReader.mjs";
import { PANCAKE_PALETTE } from "../PANCAKE_PALETTE.mjs";
import { getNearColor } from "../getNearColor.mjs";

const convert = async (fn, ratio, transcolor) => {
	const path = "../";
	const sprs = JSON.parse(fs.readFileSync(path + fn + ".json", "utf-8"));
	//console.log(sprs);

	const png2pancake = (png) => {
		const plt = png.palette;
		const res = [];
		const w = png.width / ratio;
		const h = png.height / ratio;
		//console.log(png.pixels.length, w * h * (ratio * ratio));
		//console.log(w, h, ratio);
		for (let i = 0; i < h; i++) {
			for (let j = 0; j < w; j++) {
				const idx = png.pixels[(j * ratio) + png.width * (i * ratio)] * 3;
				const c = [ plt[idx], plt[idx + 1], plt[idx + 2] ];
				//console.log(idx, min, c, PANCAKE_PALETTE[idx]); // 74.png 77.png の青がだいぶ違う
				const n = getNearColor(PANCAKE_PALETTE, c);
				if (n < 0) {
					console.log(c);
					process.exit(1);
				}
				//console.log(n);
				res.push(n.toString(16));
			}
		}
		return { w, h, s: res.join("") };
	};

	const ss = [];
	let idx = 0;
	for (const spr of sprs) {
		const buffer = fs.readFileSync(path + fn + "/" + spr.name);
		const reader = new PNGReader(buffer);
		const png = await reader.parseSync();
		const s = png2pancake(png);
		if (transcolor) {
			if (idx == 9) {
				console.log(idx, transcolor[idx]);
			}
			const transc = transcolor[idx] || parseInt(s.s.charAt(0), 16);
			s.tc = "0x" + transc.toString(16)
		}
		/*
		for (let i = 0; i < 8; i++) {
			console.log(json.substring(i * 8, i * 8 + 8));
		}
		console.log("*");
		*/
		ss.push(s);
		idx++;
		//break;
	}
	const json = "[\n" + ss.map(d => `  { width: ${d.w}, height: ${d.h}, ${ transcolor ? "tc: " + d.tc + "," : ""} data: "${d.s}"`).join(" },\n") + " }\n]\n";
	const mname = fn.toUpperCase();
	const mjs = "const " + mname + " = " + json + "export { " + mname + " };\n";
	fs.writeFileSync("../" + fn + "_data.json", json);
	fs.writeFileSync("../" + mname + ".mjs", mjs);
};

const sprite_transcolor = {
	0x01: 0x1,
	0x08: 0x1,
	0x09: 0x1,
	0x44: 0x0,
	0x5d: 0xa,
	0x5e: 0xa,
	0x5f: 0xa,
	0x60: 0xa,
	0x61: 0xa,
	0x62: 0xa,
	0x63: 0xa,
	0x64: 0xa,
	0x65: 0x0,
	0x6d: 0x8,
	0x6e: 0x8,
	0x6f: 0x8,
};

await convert("sprite", 4, sprite_transcolor);
await convert("img", 2);
