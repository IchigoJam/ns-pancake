import { setUI, getContext } from "./canvasutil.mjs";
import { PANCAKE_PALETTE } from "./PANCAKE_PALETTE.mjs";
import { IMG } from "./IMG.mjs";
import { SPRITE } from "./SPRITE.mjs";

const dw = 80;
const dh = 45;

const MAX_SPRITE = 16;

const init = (canvas) => {
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

};

class NSPanCake extends HTMLElement {
	constructor() {
		super();
		const canvas = document.createElement("canvas");
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		this.style.display = "inline-block";
		const r = 8;
		this.style.width = (dw * r) + "px";
		this.style.height = (dh * r) + "px";
		this.appendChild(canvas);
		this.sprite = [];
		this.spritetid = null;
		this.usersprite = [];
		//init(canvas);

		const g = getContext(canvas);
		this.g = g;
		setUI(canvas);
		this.dots = [];
		g.draw = () => {
			//const tw = Math.min((g.cw * .9 / dw) >> 0, (g.ch * .9 / dh) >> 0);
			const tw = Math.min(g.cw / dw, g.ch / dh);
	//		tw = Math.min((g.cw / (dw + 2)) >> 0, (g.ch / (dh + 2)) >> 0);
			const ox = (g.cw - tw * dw) / 2;
			const oy = (g.ch - tw * dh) / 2;
			g.setColor(0, 0, 0);
			g.fillRect(0, 0, g.cw, g.ch);
	//		g.setColor(200, 200, 200);
	//		g.fillRect(ox - 1, oy - 1, tw * dw + 2, tw * dh + 2);
			const col = PANCAKE_PALETTE;

			const dots = this.dots;
			for (let i = 0; i < dh; i++) {
				for (let j = 0; j < dw; j++) {
					const c = col[dots[j + i * dw]];
					const x = ox + j * tw;
					const y = oy + i * tw;
					if (!c) {
						/*
						// 透明市松模様
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
						*/
					} else {
						g.setColor(c[0], c[1], c[2]);
						g.fillRect(x, y, tw, tw);
					}
				}
			}
		};
		
		this.g.init();
		//this.clearDots();
		this.image(0);
    
		if (window.AudioContext) {
			this.audio = new AudioContext();
			this.audioch = new Array(4);
		} else {
			console.log('Need AudioContext.');
		}
	}
	drawDot(x, y, c) {
		if (x >= 0 && x < dw && y >= 0 && y < dh) {
			this.dots[x + y * dw] = c;
		}
	}
	clearDots(c) {
		if (!c)
			c = 0;
		for (let i = 0; i < dh; i++) {
			for (let j = 0; j < dw; j++) {
				this.drawDot(j, i, c);
			}
		}
	};
	drawLineDots(x1, y1, x2, y2, c) {
		const calcDiv = (n, m) => {
			return Math.floor(n / m);
		};
		const dx = x2 - x1;
		let dx2 = dx;
		if (dx < 0)
			dx2 = -dx;
		const dy = y2 - y1;
		let dy2 = dy;
		if (dy2 < 0)
			dy2 = -dy;
		if (dx == 0 && dy == 0) {
			this.drawDot(x1, y1, c);
		} else {
			if (dx2 < dy2) {
				if (y1 < y2) {
					for (let i = 0; y1 + i <= y2; i++) {
						this.drawDot(x1 + calcDiv(dx * i, dy), y1 + i, c);
					}
				} else {
					for (let i = 0; y2 + i <= y1; i++) {
						this.drawDot(x2 + calcDiv(dx * i, dy), y2 + i, c);
					}
				}
			} else {
				if (x1 < x2) {
					for (let i = 0; x1 + i <= x2; i++) {
						this.drawDot(x1 + i, y1 + calcDiv(dy * i, dx), c);
					}
				} else {
					for (let i = 0; x2 + i <= x1; i++) {
						this.drawDot(x2 + i, y2 + calcDiv(dy * i, dx), c);
					}
				}
			}
		}
	}
	drawStamp(x, y, transcolor, ptn, flip, rotate) {
		const h = 8;
		const w = 8;
		if (flip) {
			const ptn2 = [];
			for (let i = 0; i < h; i++) {
				for (let j = 0; j < w; j++) {
					ptn2.push(ptn.charAt(i * w + (7 - j)));
				}
			}
			ptn = ptn2.join("");
		}
		if (rotate == 1) {
			const ptn2 = [];
			for (let i = 0; i < h; i++) {
				for (let j = 0; j < w; j++) {
					ptn2.push(ptn.charAt((7 - j) * w + i));
				}
			}
			ptn = ptn2.join("");
		} else if (rotate == 2) {
			const ptn2 = [];
			for (let i = 0; i < h; i++) {
				for (let j = 0; j < w; j++) {
					ptn2.push(ptn.charAt((7 - i) * w + (7 - j)));
				}
			}
			ptn = ptn2.join("");
		} else if (rotate == 3) {
			const ptn2 = [];
			for (let i = 0; i < h; i++) {
				for (let j = 0; j < w; j++) {
					ptn2.push(ptn.charAt(j * w + (7 - i)));
				}
			}
			ptn = ptn2.join("");
		}
		
		for (let i = 0; i < h; i++) {
			for (let j = 0; j < w; j++) {
				const c = parseInt(ptn.charAt(j + i * w), 16);
				if (c != transcolor) {
					this.drawDot(x + j, y + i, c);
				}
			}
		}
	}
	drawCircle(x, y, r, c) {
		const n = 32;
		let x2 = (x + r + .5) >> 0;
		let y2 = (y + .5) >> 0;
		for (let i = 1; i <= n; i++) {
			const th = Math.PI * 2 / n * i;
			const x1 = (Math.cos(th) * r + x + .5) >> 0;
			const y1 = (Math.sin(th) * r + y + .5) >> 0;
			this.drawLineDots(x1, y1, x2, y2, c);
			x2 = x1;
			y2 = y1;
		}
	}
	drawImage(n) {
		const d = IMG[n];
		if (!d) {
			return;
		}
		for (let i = 0; i < d.height; i++) {
			for (let j = 0; j < d.width; j++) {
				this.drawDot(j, i, parseInt(d.data.charAt(j + i * d.width), 16));
			}
		}
	}
	// interpreter
	parse(s) {
		const parseInt16 = (s) => {
			if (s.startsWith("0")) {
				return parseInt(s.substring(1), 16);
			}
			return parseInt(s, 16);
		};
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
				this.drawLineDots(x1, y1, x2, y2, c);
//				console.log(x1 + " "+ y1);
				continue;
			}

			n = s.indexOf("PC CIRCLE ");
			if (n >= 0) {
				const ss2 = s.substring(n + "PC CIRCLE ".length).split(" ");
				const x = parseInt16(ss2[0]);
				const y = parseInt16(ss2[1]);
				const r = parseInt16(ss2[2]);
				const c = parseInt16(ss2[3]);
				this.drawCircle(x, y, r, c);
				continue;
			}

			n = s.indexOf("PC CLEAR ");
			if (n >= 0) {
				n = parseInt16(s.substring(n + "PC CLEAR ".length).split(" ")[0]);
//				console.log("clear" + n);
				this.clearDots(n);
				continue;
			}

			n = s.indexOf("PC IMAGE ");
			if (n >= 0) {
				n = parseInt16(s.substring(n + "PC IMAGE ".length).split(" ")[0]);
				this.image(n);
				continue;
			}

			n = s.indexOf("PC STAMP ");
			if (n >= 0) {
				const ss2 = s.substring(n + "PC STAMP ".length).split(" ");
				const x = parseInt16(ss2[0]);
				const y = parseInt16(ss2[1]);
				const tc = parseInt16(ss2[2]);
				const ptn = ss2[3];
				this.stamp(x, y, tc, ptn);
				continue;
			}

			n = s.indexOf("PC STAMP1 ");
			if (n >= 0) {
				const ss2 = s.substring(n + "PC STAMP1 ".length).split(" ");
				const x = parseInt16(ss2[0]);
				const y = parseInt16(ss2[1]);
				const cn = parseInt16(ss2[2]);
				const ptn = ss2[3];
				this.stamp1(x, y, cn, ptn);
				continue;
			}

			n = s.indexOf("PC STAMPS ");
			if (n >= 0) {
				const ss2 = s.substring(n + "PC STAMPS ".length).split(" ");
				const x = parseInt16(ss2[0]);
				const y = parseInt16(ss2[1]);
				const idx = parseInt16(ss2[2]);
				const fs = ss2.length > 3 ? parseInt16(ss2[3]) : 0;
				const ra = ss2.length > 4 ? parseInt16(ss2[4]) : 0;
				this.stamps(x, y, idx, fs, ra);
				continue;
			}

			if (this.audio) {
				n = s.indexOf("PC SOUND1 ");
				if (n >= 0) {
					const ss2 = s.substring(n + "PC SOUND1 ".length).split(" ");
					const cn = parseInt16(ss2[0]);
					const on = parseInt16(ss2[1]);
					const sn = parseInt16(ss2[2]);
					this.sound1(cn, on, sn);
					continue;
				}
			}

			{
				const cmd = "PC SPRITE START ";
				const n = s.indexOf(cmd);
				if (n >= 0) {
					const ss2 = s.substring(n + cmd.length).split(" ");
					const bg = parseInt16(ss2[0]);
					this.spriteStart(bg);
					continue;
				}
			}
			{
				const cmd = "PC SPRITE CREATE ";
				const n = s.indexOf(cmd);
				if (n >= 0) {
					const ss2 = s.substring(n + cmd.length).split(" ");
					const sn = parseInt16(ss2[0]);
					const si = parseInt16(ss2[1]);
					this.spriteCreate(sn, si);
					continue;
				}
			}
			{
				const cmd = "PC SPRITE MOVE ";
				const n = s.indexOf(cmd);
				if (n >= 0) {
					const ss2 = s.substring(n + cmd.length).split(" ");
					const sn = parseInt16(ss2[0]);
					const x = parseInt16(ss2[1]);
					const y = parseInt16(ss2[2]);
					this.spriteMove(sn, x, y);
					continue;
				}
			}
			{
				const cmd = "PC SPRITE FLIP ";
				const n = s.indexOf(cmd);
				if (n >= 0) {
					const ss2 = s.substring(n + cmd.length).split(" ");
					const sn = parseInt16(ss2[0]);
					const fs = parseInt16(ss2[1]);
					this.spriteFlip(sn, fs);
					continue;
				}
			}
			{
				const cmd = "PC SPRITE ROTATE ";
				const n = s.indexOf(cmd);
				if (n >= 0) {
					const ss2 = s.substring(n + cmd.length).split(" ");
					const sn = parseInt16(ss2[0]);
					const ra = parseInt16(ss2[1]);
					this.spriteRotate(sn, ra);
					continue;
				}
			}
			{
				const cmd = "PC SPRITE USER ";
				const n = s.indexOf(cmd);
				if (n >= 0) {
					const ss2 = s.substring(n + cmd.length).split(" ");
					const sn = parseInt16(ss2[0]);
					const tc = parseInt16(ss2[1]);
					const ptn = ss2[2];
					this.spriteUser(sn, tc, ptn);
					continue;
				}
			}
			{
				const cmd = "PC RESET";
				const n = s.indexOf(cmd);
				if (n >= 0) {
					this.reset();
					continue;
				}
			}
		}
		this.g.draw();
	};

	// public
	pset(x, y, c) {
		this.drawDot(x >> 0, y >> 0, c);
		this.g.draw();
	}
	line(x1, y1, x2, y2, c) {
		this.drawLineDots(x1 >> 0, y1 >> 0, x2 >> 0, y2 >> 0, c);
		this.g.draw();
	}
	circle(x, y, r, c) {
		this.drawCircle(x, y, r, c);
		this.g.draw();
	}
	clear() {
		this.clearDots();
		this.g.draw();
	}
	image(n) {
		this.drawImage(n);
		this.g.draw();
	}
	stamp(x, y, transcolor, ptn) {
		this.drawStamp(x, y, transcolor, ptn);
		this.g.draw();
	}
	stamp1(x, y, c, ptn) {
		console.log(ptn)
		const tc = (c + 1) & 0xf;
		const tch = tc.toString(16);
		const ch = c.toString(16);
		const ptn2 = [];
		for (const c of ptn) {
			ptn2.push(c == "1" ? ch : tch);
		}
		this.stamp(x, y, tc, ptn2.join(""));
	}
	stamps(x, y, idx, fs, ra) {
		const d = SPRITE[idx];
		if (!d) {
			return;
		}
		this.drawStamp(x, y, d.tc, d.data, fs, ra);
		/*
		const transcolor = d.tc.toString(16); // d.data.charAt(0);
		for (let i = 0; i < d.height; i++) {
			for (let j = 0; j < d.width; j++) {
				const c = d.data.charAt(j + i * d.width);
				if (c != transcolor) {
					this.drawDot(x + j, y + i, parseInt(c, 16));
				}
			}
		}
		*/
		this.g.draw();
	}
	sound1(cn, on, sn) {
		const channel = cn % this.audioch.length;

		this.audioch[channel]?.stop();
		this.audioch[channel] = undefined;

		if (sn === 0xff) {
			// none
		} else {
			const key = (sn & 0x0f) % 13;
			const tone = ((sn & 0xf0) >> 4) % 4;
			const  octave = on % 8;
			const t = 0; //this.audio.currentTime;

			const gain = this.audio.createGain();
			gain.gain.setValueAtTime(0.2, t);
			gain.connect(this.audio.destination);

			this.audioch[channel] = this.audio.createOscillator();
			this.audioch[channel].type = [
				"square",
				"sine",
				"triangle",	// 暫定
				"sawtooth",	// 暫定
			][tone];
			this.audioch[channel].frequency.setValueAtTime([
				261.626,
				277.183,
				293.665,
				311.127,
				329.628,
				349.228,
				369.994,
				391.995,
				415.305,
				440.000,
				466.164,
				493.883,
			][key] * Math.pow(2, octave - 4), t);
			this.audioch[channel].connect(gain);
			this.audioch[channel].start();
		}
	}
	spriteStart(bg) {
		clearInterval(this.spritetid);
		if (bg != 0xff) {
			this.spritebg = bg;
			this.spritetid = setInterval(() => {
				if (this.spritebg < 0x10) {
					this.drawImage(this.spritebg);
				} else {
					this.clearDots(this.spritebg >> 4);
				}
				for (let i = 0; i < MAX_SPRITE; i++) {
					const sp = this.sprite[i];
					if (!sp || sp.ptn == 0xff) {
						continue;
					}
					if (sp.ptn >= 0xfd) {
						const s = this.usersprite[sp.ptn];
						if (s) {
							this.drawStamp(sp.x, sp.y, s.tc, s.data, sp.flip, sp.rotate);
						}
					} else {
						const s = SPRITE[sp.ptn];
						this.drawStamp(sp.x, sp.y, s.tc, s.data, sp.flip, sp.rotate);
					}
				}
				this.g.draw();
			}, 1000 / 60);
		}
	}
	getSprite(sn) {
		if (sn < 0 || sn >= MAX_SPRITE) {
			return null;
		}
		const sp = this.sprite[sn];
		if (sp) {
			return sp;
		}
		return this.sprite[sn] = {
			x: 0,
			y: 0,
			ptn: 0xff,
			flip: false,
			rotate: 0,
		};
	}
	spriteCreate(sn, si) {
		const sp = this.getSprite(sn);
		if (sp) {
			sp.ptn = si;
		}
	}
	spriteMove(sn, px, py) {
		const sp = this.sprite[sn];
		if (sp) {
			sp.x = px;
			sp.y = py;
		}
	}
	spriteFlip(sn, fs) {
		const sp = this.sprite[sn];
		if (sp) {
			sp.flip = fs != 0;
		}
	}
	spriteRotate(sn, ra) { // 00:0°,01:-90°,02:180°,03:90°
		const sp = this.sprite[sn];
		if (sp) {
			sp.rotate = ra;
		}
	}
	spriteUser(sn, tc, ptn) {
		if (sn >= 0xfd && sn <= 0xfe) {
			this.usersprite[sn] = { tc, data: ptn };
		}
	}
	reset() {
		this.spriteStart(0xff);
		this.sprite = [];
		this.spritetid = null;
		this.usersprite = [];
		this.clear(0);
	}
}

customElements.define('ns-pancake', NSPanCake);
