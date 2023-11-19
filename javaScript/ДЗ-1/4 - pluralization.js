function pluralizeRecords(n) {
    if (n < 0 || n % 1 != 0) {
        return NaN;
    }

    // сюда запишем кол-во записией с учётом склонения
    records = "";
    found = "";

    // определяем склонение
    let isTen = (n % 100 >= 10 && n % 100 <= 19);

    if (n % 10 == 1 && !isTen) {
        records = 'запись';
        found = 'была найдена';
    } else if (2 <= n % 10 && n % 10 <= 4 && !isTen) {
        records = 'записи';
        found = 'были найдены';        
    } else {
        records = 'записей';
        found = 'было найдено';        
    }

    // формируем финальную строку
    return `В результате выполнения запроса ${found} ${n} ${records}`;
}