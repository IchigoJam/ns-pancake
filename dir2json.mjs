import { CSV } from "https://js.sabae.cc/CSV.js";

if (Deno.args.length == 0) {
	console.log("deno run -A dir2json.js [dirname]");
	Deno.exit(1);
}
const dir = Deno.args[0];
const data = [];
for await (const fn of Deno.readDirSync(dir)) {
	//console.log(fn);
	if (fn.name.startsWith(".") || fn.isDirectory) {
		continue;
	}
	data.push({ name: fn.name });
}
data.sort((a, b) => {
	const na = parseInt(a.name, 16);
	const nb = parseInt(b.name, 16);
	return na - nb;
});
Deno.writeTextFileSync(dir + ".json", JSON.stringify(data, null, 2));
Deno.writeTextFileSync(dir + ".csv", CSV.encode(CSV.fromJSON(data)));
console.log("output: " + dir + ".json / " + dir + ".csv");
