// src/main.zig
const std = @import("std");

// pub fn main() anyerror!void {
//     const stdout = std.io.getStdOut().writer();
//     try stdout.print("Hello, World!\n", .{});
// }

export fn test1() usize {
    return 1;
}

export fn test2(num1: usize, num2: usize) usize {
    return num1 +| num2;
}
