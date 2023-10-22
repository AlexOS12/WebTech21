function minDigit(x) {
    // тут будет хранится минимальная цифра
    mn = 10

    // просто пробегаемся по всем цифрам в числе,
    // начиная с конца
    while (x > 0) {
        // текущая цифра
        curDigit = x % 10

        // целочисленное деление        
        x = (x - curDigit) / 10

        if (curDigit < mn) {
            mn = curDigit
        } 
    }

    return mn
}