const fs = require("fs");
const content = fs.readFileSync("./zig-out/bin/bf_zig.wasm");

async function bfInterpret(bf_input) {
	try {
		const module = await WebAssembly.compile(content);
		const out_buf = [];

		const instance = new WebAssembly.Instance(module, {
			env: {
				print: (x) => console.log(x),
				printChar: (x) => process.stdout.write(String.fromCharCode(x)),
				printToOut: (x) => out_buf.push(x),
			},
		});

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

const input = "+++++++++[>++++++++>+++++++++++>+++>+<<<<-]>.>++.+++++++..+++.>+++++.<<+++++++++++++++.>.+++.------.--------.>+.>+.";
bfInterpret(input).then((out) => {
	console.log(`out: ${out}`);
});

// function inspectMemory(memory) {
//   const pageSize = 2 ** 16;
// 
//   console.log('pages:', memory.buffer.byteLength / pageSize);
//   const memoryView = new Uint8Array(memory.buffer);
//   const used = [];
//   for (let i = 0; i < memoryView.length; i++) {
//     if (memoryView[i]) {
//       const start = i;
// 
//       while (true) {
//         const maxLookForwardBytes = 300;
//         const bytesLeft = memoryView.length - i;
//         const lookForwardBytes = Math.min(maxLookForwardBytes, bytesLeft);
//         const forwardView = new Uint8Array(memory.buffer, i, lookForwardBytes);
//         if (forwardView.every((byte) => byte === 0)) break;
// 
//         i++;
//       }
// 
//       used.push([start, i - start]);
//     }
//   }
//   console.log(
//     used.map(
//       ([start, length]) =>
//         `page:${Math.floor(start / pageSize)} offset:${start % pageSize} bytes:${length}`
//     ),
//     '\n'
//   );
// }

