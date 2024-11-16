// call_wasm.js
const fs = require("fs");
const content = fs.readFileSync("./zig-out/bin/bf_zig.wasm");
// const content = fs.readFileSync("./main.wasm");

//WebAssembly.instantiate(content, { env: { print: (x) => console.log(x) } })
//.then((result) => {
//	console.log(result.instance.exports);
//  // const add = result.instance.exports.add;
//  // add(1, 2);
//});

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
	 //  console.log(lib);
	  console.log(lib.test1()); // 1
	  console.log(lib.test2(128, 128)); // 256
  })
  .catch((e) => {
    console.error(e);
  });
