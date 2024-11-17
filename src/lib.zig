const std = @import("std");

extern fn print(i32) void;
extern fn printChar(u8) void;

export fn returnString(s: [*]u8, num: usize) usize {
    var bf_memory = [_]u8{0} ** 0x100;
    @memset(&bf_memory, 0xa);

    s[0] = 'h';
    return num * 2;
}

inline fn bfMemoryInit(bf_input: [*]u8, length: usize) []u8 {
    const BF_MEMORY_LEN = 0x100;
    const memory = bf_input[length .. length + BF_MEMORY_LEN];
    @memset(memory, 0);
    return memory;
}

inline fn findRBracket(l_loc: usize, input: []u8) usize {
    const BRACKET_R = ']';
    for (l_loc..input.len) |i|
        if (input[i] == BRACKET_R) return i;
    return 0xdeadbeef;
}

// return length of output string;
export fn bfInterpret(bf_input: [*]u8, length: usize) usize {
    var bf_memory = bfMemoryInit(bf_input, length);
    _ = &bf_memory;

    // interpret input string;
    {
        const PTR_INC = '>';
        const PTR_DEC = '<';
        const INC = '+';
        const DEC = '-';
        const OUT = '.';
        const IN = ',';
        const BRACKET_L = '[';
        const BRACKET_R = ']';

        var ins_index: usize = 0;
        var ptr: usize = 0;
        var l_bracket_loc: usize = 0;
        var r_bracket_loc: usize = 0;

        interpret: while (true) {
            const ins = bf_input[ins_index];

            switch (ins) {
                PTR_INC => ptr += 1,
                PTR_DEC => ptr -= 1,
                INC => bf_memory[ptr] += 1,
                DEC => bf_memory[ptr] -= 1,
                OUT => printChar(bf_memory[ptr]),
                IN => {
                    return 0;
                },
                BRACKET_L => {
                    l_bracket_loc = ins_index;
                    // jump to next ']'
                    if (bf_memory[ptr] == 0) {
                        if (l_bracket_loc < r_bracket_loc) {
                            ins_index = r_bracket_loc;
                            continue :interpret;
                        }

                        r_bracket_loc = findRBracket(
                            l_bracket_loc,
                            bf_input[0..length],
                        );
                        if (r_bracket_loc == 0xdeadbeef)
                            return 1;
                        ins_index = r_bracket_loc;
                        continue :interpret;
                    }
                },
                BRACKET_R => {
                    r_bracket_loc = ins_index;
                    // go back to previous '['
                    if (bf_memory[ptr] != 0) {
                        ins_index = l_bracket_loc;
                        continue :interpret;
                    }
                },
                else => {
                    return 0;
                },
            }

            ins_index += 1;
        }
    }

    return 0;
}

//
//
// const hoge = std.wasm.Export(
//     "bfInterpret",
//     .{.function},
//     0,
// );
// const moduleBase = std.wasm.Import{
//     .module_name = "env",
//     .name = "moduleBase",
//     .kind = .{
//         .function = 3,
//     },
// };
// const moduleBase = std.wasm.Import{
//     .module_name = "env",
//     .name = "moduleBase",
//     .kind = .{
//         .global = .{
//             .valtype = .i32,
//             .mutable = false,
//         },
//     },
// };
