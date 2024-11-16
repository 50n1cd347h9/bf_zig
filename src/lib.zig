export fn test1() usize {
    return 1;
}

export fn test2(num1: usize, num2: usize) usize {
    return num1 +| num2;
}

export fn returnString(s: [*]u8, num: usize) usize {
    s[0] = 'h';
    return num * 2;
}
