import { jsonp, getCallbackMethod, setUI, getContext } from "./fukuno.mjs";

const init = function() {
	const g = getContext(canvas);
	setUI(canvas);
	
	const dots = [];
	const dw = 80;
	const dh = 45;
	const getImage = function() {
		const canvas = create("canvas");
		canvas.width = dw;
		canvas.height = dh;
		const g = canvas.getContext("2d");
		const tw = 1;
		col = PC_PALETTE;
		for (let i = 0; i < dh; i++) {
			for (let j = 0; j < dw; j++) {
				const x = j * tw;
				const y = i * tw;
				const c = col[dots[j + i * dw]];
				if (c !== null) {
					g.fillStyle = "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
					g.fillRect(x, y, tw, tw);
				}
			}
		}
		const data = canvas.toDataURL("image/png"); // image/jpeg
		return data;
//		const img = new Image();
//		img.src = data;
//		return img;
	};
	const getImageText = function() {
		const s = "const unsigned char test[] = {\n";
		for (let i = 0; i < dh; i += 8) {
			for (let j = 0; j < dw; j++) {
				const n = 0;
				for (const k = 0; k < 8; k++) {
					n += dots[j + (i + k) * dw] << k;
				}
				s += "0x" + dec2hex(n, 2) + ", ";
			}
			s += "\n";
		}
		s += "};\n";
		return s;
	};
	const getImageTextShort = function() {
		const s = "";
		for (let i = 0; i < dh; i += 8) {
			for (let j = 0; j < dw; j++) {
				const n = 0;
				for (const k = 0; k < 8; k++) {
					n += dots[j + (i + k) * dw] << k;
				}
				s += dec2hex(n, 2);
			}
		}
		return s;
	};
	const getImageText16 = function() {
//		const s = "stamp(\"";
		const s ="";
		for (let i = 0; i < dw * dh / 8; i++) {
			const x = (i / dh >> 0) * 8;
			const y = i % dh;
			const n = 0;
			for (const k = 0; k < 8; k++) {
				n += dots[x + k + y * dw] << (8 - 1 - k);
			}
			s += dec2hex(n, 2);
		}
//		s += "\",21,21)\n";
		return s;
	};
	const getImageTextVertical = function() {
//		const s = "stamp(\"";
		const s ="";
		for (let i = 0; i < dw * dh / 4; i++) {
			const x = (i / dh >> 0) * 4;
			const y = i % dh;
			const n = 0;
			for (const k = 0; k < 4; k++) {
				n += dots[x + k + y * dw] << (3 - k);
			}
			s += dec2hex(n, 1);
		}
//		s += "\",21,21)\n";
		return s;
	};
	const makeImage = function(s) {
		for (let i = 0; i < dw * dh / 4; i++) {
			const c = "0";
			if (i < s.length)
				c = s.charAt(i);
			const x = (i / dh >> 0) * 4;
			const y = i % dh;
			const n = parseInt(c, 16);
			for (const k = 0; k < 4; k++) {
				dots[x + k + y * dw] = (n & (1 << (3 - k))) == 0 ? 0 : 1;
			}
		}
		g.draw();
		img.src = getImage();
	};
	const makeImage16 = function(s) {
		for (let i = 0; i < dw * dh / 4; i += 2) {
			const c = "00";
			if (i + 1 < s.length)
				c = s.substring(i, i + 2);
			const x = (i / dh >> 0) * 8;
			x = 0;
			const y = (i / 2) >> 0;
			const n = parseInt(c, 16);
			for (const k = 0; k < 8; k++) {
				dots[x + k + y * dw] = (n & (1 << (8 - 1 - k))) == 0 ? 0 : 1;
			}
		}
		g.draw();
		img.src = getImage();
	};
	
	let col = [
		[ 0, 0, 0],
		[ 255, 255, 255 ], //null,
		[ 127, 0, 0 ],
		[ 255, 0, 0 ],
		[ 127, 127, 0 ],
		[ 255, 255, 0 ],
		[ 127, 127, 127 ],
		[ 255, 255, 255 ],
	];
	const clearDots = function(c) {
		if (!c)
			c = 0;
		for (let i = 0; i < dh; i++) {
			for (let j = 0; j < dw; j++) {
				dots[j + i * dw] = c;
			}
		}
	};
	const drawLineDots = function(x1, y1, x2, y2, c) {
		if (x1 == x2) {
			for (let i = y1; i <= y2; i++) {
				dots[x1 + i * dw] = c;
			}
		} else if (y1 == y2) {
			for (let i = x1; i <= x2; i++) {
				dots[i + y1 * dw] = c;
			}
		} else {
			// not implemented
		}
	};
	clearDots();
	
	let ox = 0;
	let oy = 0;
	let tw = 8;
	g.draw = function() {
//		tw = Math.min((g.cw * .9 / dw) >> 0, (g.ch * .9 / dh) >> 0);
//		tw = Math.min((g.cw / (dw + 2)) >> 0, (g.ch / (dh + 2)) >> 0);
		ox = (g.cw - tw * dw) / 2;
		oy = (g.ch - tw * dh) / 2;
		g.setColor(0, 0, 0);
		g.fillRect(0, 0, g.cw, g.ch);
//		g.setColor(200, 200, 200);
//		g.fillRect(ox - 1, oy - 1, tw * dw + 2, tw * dh + 2);
		col = PC_PALETTE;
		for (let i = 0; i < dh; i++) {
			for (let j = 0; j < dw; j++) {
				const c = col[dots[j + i * dw]];
				const x = ox + j * tw;
				const y = oy + i * tw;
				if (c === null) {
					const tw2 = tw / 2;
					if (tw % 2 == 1) {
						tw2 = (tw - 1) / 2;
					}
					g.setColor(255, 255, 255);
					g.fillRect(x, y, tw2, tw2);
					g.fillRect(x + tw2, y + tw2, tw2, tw2);
					g.setColor(200, 200, 200);
					g.fillRect(x + tw2, y, tw2, tw2);
					g.fillRect(x, y + tw2, tw2, tw2);
				} else {
					g.setColor(c[0], c[1], c[2]);
					g.fillRect(x, y, tw, tw);
				}
			}
		}
	};
	
	g.init();
//	clearDots(3);
//	g.draw();
	
	const parseInt16 = function(s) {
		if (s.startsWith("0")) {
			return parseInt(s.substring(1), 16);
		}
		return parseInt(s, 16);
	};
	
	const parse = function(s) {
		const ss = s.split("\n");
//		dump(ss);
		for (let i = 0; i < ss.length; i++) {
			s = ss[i];
			let n = s.indexOf("REM");
			if (n >= 0)
				s = s.substring(0, n);
			n = s.indexOf("'");
			if (n >= 0)
				s = s.substring(0, n);
			n = s.indexOf("PC LINE ");
			if (n >= 0) {
				const ss2 = s.substring(n + "PC LINE ".length).split(" ");
				const x1 = parseInt16(ss2[0]);
				const y1 = parseInt16(ss2[1]);
				const x2 = parseInt16(ss2[2]);
				const y2 = parseInt16(ss2[3]);
				const c = parseInt16(ss2[4]);
				drawLineDots(x1, y1, x2, y2, c);
//				console.log(x1 + " "+ y1);
				continue;
			}
			n = s.indexOf("PC CLEAR ");
			if (n >= 0) {
				n = parseInt16(s.substring(n + "PC CLEAR ".length).split(" ")[0]);
//				console.log("clear" + n);
				clearDots(n);
				continue;
			}
		}
		g.draw();
	};
	
	get.onclick = function() {
	//	const url = "http://localhost:8080/test.txt";
	//	const url = "http://www.openspc2.org/data/g1/12.txt";
		
		getRawJSON(url.value, "SJIS", function(s) {
			ta.value = s;
			parse(s);
		});
	};
	parse.onclick = function() {
		parse(ta.value);
	};
};

const PC_PALETTE = [
	[ 0, 0, 0 ],
	[ 255, 255, 255 ],
	[ 227, 27, 41 ],
	[ 255, 104, 139 ],
	[ 242, 126, 48 ],
	[ 255, 203, 61 ],
	[ 255, 222, 169 ],
	[ 107, 74, 43 ],
	[ 145, 202, 24 ],
	[ 28, 75, 55 ],
	[ 67, 175, 215 ],
	[ 38, 74, 208 ],
	[ 26, 36, 102 ],
	[ 99, 55, 187 ],
	[ 178, 63, 171 ],
	[ 204, 204, 204 ]
];

const getRawJSON = function(url, srcenc, callback) {
	//const host = "sabae.club";
	const host = "fukuno.jig.jp";
//	const host = "localhost:8080";
	const cache = "no";
	const base = "https://" + host + "/proxy/ITqT5WkhCf2yn1s9?";
	const url2 = base + "cnv=json&srcenc=" + srcenc + "&cache="  + cache + "&callback=" + getCallbackMethod(callback) + "&url=" + encodeURIComponent(url);
	jsonp(url2);
};

window.addEventListener("load", init);
