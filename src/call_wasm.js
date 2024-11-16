const fs = require("fs");
const content = fs.readFileSync("./zig-out/bin/bf_zig.wasm");

WebAssembly.compile(content)
  .then((module) => {
    const lib = new WebAssembly.Instance(module, {
      env: {
        memoryBase: 0,
        tableBase: 0,
        memory: new WebAssembly.Memory({ initial: 256 }),
        table: new WebAssembly.Table({ initial: 0, element: "anyfunc" }),
      },
    }).exports;

	  const memory = lib.memory;
      const memoryView = new Uint8Array(memory.buffer);

	  const input = "Hello Worldhogehoge";
  	  const { written } = new TextEncoder().encodeInto(input, memoryView);

	  const ret = lib.returnString(0, written);

	  console.log(`ret is ${ret}`);
	  const outputView = new Uint8Array(memory.buffer, 0, written);
	  console.log(new TextDecoder().decode(outputView));
  })
  .catch((e) => {
    console.error(e);
  });
