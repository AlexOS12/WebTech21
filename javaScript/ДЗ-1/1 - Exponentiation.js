function pow(x, n) {
    // проверяем что n - натуральное
    if (n < 0 || n % 1 != 0) {
        return NaN
    }

    res = 1
    
    for (i = 0; i < n; i++) {
        res *= x
    }

    return res
}