const std = @import("std");

pub fn build(b: *std.Build) void {
    _ = b;

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    defer {
        _ = gpa.deinit();
    }
    std.process.execv(
        allocator,
        &[_][]const u8{
            "zig",
            "build-exe",
            "src/lib.zig",
            "-O",
            "ReleaseFast",
            "-target",
            "wasm32-wasi",
            "-fno-entry",
            "--export=bfInterpret",
            "-femit-bin=zig-out/bin/bf_zig.wasm",
        },
    ) catch {};
}
