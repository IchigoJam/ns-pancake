# ns-pancake
PanCake web  
https://ichigojam.github.io/ns-pancake/  
IchigoJam web + PanCake
https://fukuno.jig.jp/app/IchigoJam/pancake.html

## license
CC BY-NC Natural Style Co. Ltd.  
http://pancake.shizentai.jp/  

## usage
```HTML
<html>
<body>
<script type="module" src="https://ichigojam.github.io/ns-pancake/pancake.mjs"></script>
<ns-pancake id="pancake"></ns-pancake>

<script type="module">
const pw = 80;
const ph = 45;
const rnd = (n) => Math.random() * n >> 0;

// pancake test
setInterval(() => {
	pancake.clear();
	for (let i = 0; i < 100; i++) {
		pancake.line(pw / 2, ph / 2, rnd(pw), rnd(ph), rnd(16));
		pancake.pset(rnd(pw), rnd(ph), rnd(16));
	}
}, 500);
</script>
</body>
</html>
```

## blog
https://fukuno.jig.jp/3179  

## lib
arian/pngjs: Pure JavaScript PNG decoder  
https://github.com/arian/pngjs  

