const fs = require("fs");
const content = fs.readFileSync("./zig-out/bin/bf_zig.wasm");

WebAssembly.compile(content)
  .then((module) => {
      const instance = new WebAssembly.Instance(module, {
        env: {
	  	  	print: (x) => console.log(x),
			printChar: (x) => process.stdout.write(String.fromCharCode(x)),
          	memoryBase: 0,
          // tableBase: 0,
          // memory: new WebAssembly.Memory({ initial: 256 }),
          // table: new WebAssembly.Table({ initial: 0, element: "anyfunc" }),
        },
      });
	  const lib = instance.exports;

	  const memory = lib.memory;
      const memoryView = new Uint8Array(memory.buffer);

	  // const input = "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.+.+.>++++++++++.";
	  const input = "+++++++++[>++++++++>+++++++++++>+++>+<<<<-]>.>++.+++++++..+++.>+++++.<<+++++++++++++++.>.+++.------.--------.>+.>+.";
	  console.log(`input: ${input}`);
	  // copy input to wasm memory
  	  const { written } = new TextEncoder().encodeInto(input, memoryView);

	  //
	  // call bf interpreter
	  const ret = lib.bfInterpret(0, written);

	  const outputView = new Uint8Array(memory.buffer, 0, written);
	  console.log(`ret is ${ret}`);
  })
  .catch((e) => {
    console.error(e);
  });


function inspectMemory(memory) {
  const pageSize = 2 ** 16;

  console.log('pages:', memory.buffer.byteLength / pageSize);
  const memoryView = new Uint8Array(memory.buffer);
  const used = [];
  for (let i = 0; i < memoryView.length; i++) {
    if (memoryView[i]) {
      const start = i;

      while (true) {
        const maxLookForwardBytes = 300;
        const bytesLeft = memoryView.length - i;
        const lookForwardBytes = Math.min(maxLookForwardBytes, bytesLeft);
        const forwardView = new Uint8Array(memory.buffer, i, lookForwardBytes);
        if (forwardView.every((byte) => byte === 0)) break;

        i++;
      }

      used.push([start, i - start]);
    }
  }
  console.log(
    used.map(
      ([start, length]) =>
        `page:${Math.floor(start / pageSize)} offset:${start % pageSize} bytes:${length}`
    ),
    '\n'
  );
}

