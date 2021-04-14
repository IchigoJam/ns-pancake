const getNearColor = (palette, c) => {
	const n = palette.findIndex(p => p[0] == c[0] && p[1] == c[1] && p[2] == c[2]);
	if (n >= 0) {
		return n;
	}
	let min = 255;
	let idx = -1;
	for (let i = 0; i < palette.length; i++) {
		const p = palette[i];
		const d = Math.abs(p[0] - c[0]) + Math.abs(p[1] - c[1]) + Math.abs(p[2] - c[2]);
		if (d < min) {
			min = d;
			idx = i;
		}
	}
	return idx;
};

export { getNearColor };

