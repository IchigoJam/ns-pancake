import fs from "fs";
import { PNGReader } from "./PNGReader.mjs";
import { PANCAKE_PALETTE } from "../PANCAKE_PALETTE.mjs";

const convert = async (fn, ratio) => {
	const path = "../";
	const sprs = JSON.parse(fs.readFileSync(path + fn + ".json", "utf-8"));
	//console.log(sprs);

	const getNearColor = (c) => {
		const n = PANCAKE_PALETTE.findIndex(p => p[0] == c[0] && p[1] == c[1] && p[2] == c[2]);
		if (n >= 0) {
			return n;
		}
		let min = 255;
		let idx = -1;
		for (let i = 0; i < PANCAKE_PALETTE.length; i++) {
			const p = PANCAKE_PALETTE[i];
			const d = Math.abs(p[0] - c[0]) + Math.abs(p[1] - c[1]) + Math.abs(p[2] - c[2]);
			if (d < min) {
				min = d;
				idx = i;
			}
		}
		//console.log(idx, min, c, PANCAKE_PALETTE[idx]); // 74.png 77.png の青がだいぶ違う
		return idx;
	}

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
				const n = getNearColor(c);
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
	for (const spr of sprs) {
		const buffer = fs.readFileSync(path + fn + "/" + spr.name);
		const reader = new PNGReader(buffer);
		const png = await reader.parseSync();
		const s = png2pancake(png);
		/*
		for (let i = 0; i < 8; i++) {
			console.log(json.substring(i * 8, i * 8 + 8));
		}
		console.log("*");
		*/
		ss.push(s);
		//break;
	}
	const json = "[\n" + ss.map(d => `  { width: ${d.w}, height: ${d.h}, data: "${d.s}"`).join(" },\n") + " }\n]\n";
	const mname = fn.toUpperCase();
	const mjs = "const " + mname + " = " + json + "export { " + mname + " };\n";
	fs.writeFileSync("../" + fn + "_data.json", json);
	fs.writeFileSync("../" + mname + ".mjs", mjs);
};

await convert("sprite", 4);
await convert("img", 2);
