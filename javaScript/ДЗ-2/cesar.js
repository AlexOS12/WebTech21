"use strict"

// А - 1040, Я - 1071, Ё - 1025
// а - 1072, я - 1103, ё - 1105 

function cesar(str, shift, action) {
    shift = shift % 33;
    let lilLetters = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
    let bigLetters = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    let res = "";

    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (code >= 1040 && code <= 1071 || code == 1025) {
            let id = bigLetters.indexOf(str[i]);
            if (action == "encode") {
                id = (id + shift) % 33;
                res = res + bigLetters[id];
            } else if (action == "decode") {
                id = (id - shift) % 33;
                res = res + bigLetters[id];
            }
        } else if (code >= 1072 && code <= 1103 || code == 1105) {
            let id = lilLetters.indexOf(str[i]);
            if (action == "encode") {
                id = (id + shift) % 33;
                res = res + lilLetters[id];
            } else if (action == "decode") {
                id = (33 + id - shift) % 33;
                res = res + lilLetters[id];
            }
        } else {
            res = res + str[i];
        }
    }
    return res;
}

// Пример работы кода
let strA = "АаБбВвГгДд 123+77=200 Hello, World!"
let encodedStrA = cesar(strA, 5, 'encode');
console.log(encodedStrA);
let decodedStrA = cesar(encodedStrA, 5, 'decode');
console.log(decodedStrA);

// Расшифровка фразы: "эзтыхз фзъзъз"
let secret = "эзтыхз фзъзъз";
let decodedSecret = cesar(secret, 8, 'decode');
console.log(decodedSecret);

// Ответ: "хакуна матата"