"use strict";

// Сортировка обменом
function getSortedArray(array, key) {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[j][key] < array[i][key]) {
                let t = array[j];
                array[j] = array[i];
                array[i] = t;
            }
        }
    }
    return array;
}