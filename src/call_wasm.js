const fs = require("fs");
const content = fs.readFileSync("./zig-out/bin/bf_zig.wasm");

function removeNewlines(str) {
	return str.replace(/[\r\n]/g, '');
}
function removeWhitespace(str) {
	return str.replace(/\s+/g, '');
}

var instance;
async function bfInterpret(bf_input) {
	bf_input = removeWhitespace(removeNewlines(bf_input));
	try {
		const module = await WebAssembly.compile(content);
		const out_buf = [];

		if (instance == undefined) {
			instance = new WebAssembly.Instance(module, {
				env: {
					print: (x) => console.log(x),
					printChar: (x) => process.stdout.write(String.fromCharCode(x)),
					printToOut: (x) => out_buf.push(x),
				},
			});
		} 

		const lib = instance.exports;
		const memory = lib.memory;
		const memoryView = new Uint8Array(memory.buffer);

		const { written } = new TextEncoder().encodeInto(bf_input, memoryView);

		lib.bfInterpret(0, written);

		const ret = String.fromCharCode(...new Uint8Array(out_buf));

		return ret;
	} catch (e) {
		console.error(e);
		return null;
	}
}

var input = 
`+++++++++[>++++++++>+++++++++++>+++>+<<<<-]>
	.
	>++
	.
	+++++++
	.
	.
	+++
	.
	>+++++
	.
	<<+++++++++++++++
	.
	>
	.
	+++
	.
	------
	.
	--------
	.
	>+
	.
	>+
	.`;

bfInterpret(input).then((out) => {
	console.log(`input : ${input}`);
	console.log(`output: ${out}`);
});
