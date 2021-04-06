import { fix0 } from "https://js.sabae.cc/fix0.js";

const fld = [
"./image/image/00.pancake.png",
"./image/image/01.field.png",
"./image/image/02.race.png",
"./image/image/kouya.png",
"./image/image/water.png",
"./image/image/sky.png",
"./image/image/space.png",
"./image/image/phantasy.png",
]

for (let i = 0; i < fld.length; i++) {
    //const url = `http://pancake.shizentai.jp/image/image/${fix0(i, 2)}.pancake.png`;
    const url = "http://pancake.shizentai.jp/" + fld[i].substring(2);
    console.log(url);
    const fn = url.substring(url.lastIndexOf('/'));
    const bin = new Uint8Array(await (await fetch(url)).arrayBuffer());
    Deno.writeFileSync("img/" + fix0(i, 2) + ".png", bin);
}

