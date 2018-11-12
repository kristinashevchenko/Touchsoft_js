/* eslint no-var: "off" */
/* eslint no-unused-vars: "off" */

/* eslint max-len: "off" */

/**
 * Функция вывода строк для работы в fizzBuzz
 * @param {*} a
 */
function log(a) {
    console.log(a);
}

/* Раместите ваш код ниже */

/**
 * реализовать фукнцию `fizzBuzz`
 * которая выводит числа от 1 до 100.
 * Если число кратно 3 - вместо числа вывести `Fizz`.
 * Если кратно 5 - вывести вместо числа `Buzz`.
 * Если число кратно и 3 и 5 - вывести вместо числа `FizzBuzz`.
 * Для вывода использовать фукнцию `log` (аналогично заданию в классе).
 * В теле функции нельзя использовать  `if`, `switch`, тернарный оператор `? :`
 */

function fizzBuzz() {
    for (let i = 1; i <= 100; i++) {
        (i % 3 === 0)&& (i % 5 === 0)&& log("FizzBuzz");
        (i % 3 === 0)&& (i % 5 !== 0)&& log("Fizz");
        (i % 3 !== 0)&& (i % 5 === 0)&& log("Buzz");
        (i % 3 !== 0)&& (i % 5 !== 0)&& log(i);



    }
}


/**
 * реализовать фукнцию  `isPolindrom`,
 * которая принимает на вход строку и возвращает результат проверки (`true`/ `false` ),
 * является строка полндромом (одинакого читается с лева на право и с права на лево ) или нет
 * @param {string} textString
 * @return {boolean} Является строка полндромом (одинакого читается с лева на право и с права на лево ) или нет
 */
function isPolindrom(textString) {
    let str = (textString.split("")).reverse().join("");
    return str === textString;
}


/**
 * Реализовать фукнцию `drawCalendar` ,
 * которая принимает три аргумента - год, месяц, htmlElement
 * и выводит в этот элемент календарь на месяц (дни недели начинаются с понедельника ).
 * @param {number} year
 * @param {number} month - номер месяца, начиная с 1
 * @param {external:HTMLElement} htmlEl
 */

function drawCalendar(year, month, htmlEl) {
    let monthes = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month2 = month - 1;
    let date = new Date(year, month2);
    let table = document.createElement("table");
    let mon_name = document.createElement("th");
    mon_name.textContent = monthes[month2] + " " + year;
    for (let i = 0; i < getNumberDay(date); i++) {
        table.appendChild(document.createElement("td"));
    }
    while (date.getMonth() == month2) {
        let td = document.createElement("td");
        td.textContent = date.getDate();
        table.appendChild(td);
        if (getNumberDay(date) % 7 == 6) {
            table.appendChild(document.createElement("tr"));
        }
        date.setDate(date.getDate() + 1);
    }
    if (getNumberDay(date) != 0) {
        for (let i = getNumberDay(date); i < 7; i++) {
            table.appendChild(document.createElement("td"));
        }
    }
    mon_name.appendChild(table);
    htmlEl.appendChild(mon_name);
}

function getNumberDay(date) {
    let d = date.getDay();
    if (d == 0) {
        return 6;
    }
    else {
        return d - 1;
    }
}


/**
 * Написать функцию `isDeepEqual`
 * которая принимает на вход двe переменных
 * и проверяет идентичны ли они по содержимому. Например
 * @param {*} objA
 * @param {*} objB
 * @return {boolean} идентичны ли параметры по содержимому
 */
function isDeepEqual(objA, objB) {
    let arrA = Object.keys(objA);
    let arrB = Object.keys(objB);

    if (arrA.length !== arrB.length)
        return false;
    else if (arrA.length == 0) {
        if (objA === objB)
            return true;
        else return false;
    }
    arrA.sort();
    arrB.sort();
    for (let i = 0; i < arrA.length; i++) {
        if (arrA[i] !== arrB[i]) {
            return false;
        }
        else if (typeof objA !== "object" && typeof objB !== "object") {
            if (objA[arrA[i]] !== objB[arrB[i]]) {
                return false;
            }
        }
        else if (!isDeepEqual(objA[arrA[i]], objB[arrB[i]])) {
            return false;
        }
    }
    return true;
}

function quadraticEquation(a, b, c) {
    let arr = [];
    if (a != 0) {
        let d = b * b - 4 * a * c;
        if (d === 0) {
            arr[0] = (-b / 2 * a);
        }
        else if (d > 0) {
            arr[0] = (-b + Math.pow(d, 1 / 2)) / (2 * a);
            arr[1] = (-b - Math.pow(d, 1 / 2)) / (2 * a);
        }
    }
    else {
        if (b != 0) {
            arr[0] = -c / b;
        }
    }
    return arr;
}

function spiral(arr){
    let mas=[];
    let k = Math.round(Math.min(arr[0].length, arr.length) / 2);
    let l1 = arr.length;
    let l2 = arr[0].length;
    let delta = 0;
    let num=0;
    while (k!== 0) {
        let row = delta;
        for (let i = delta; i < l2 - delta; i++) {
            mas[num] = arr[row][i];
            num++;
        }
        let column = l2 - delta - 1;
        for (let i = row + 1; i < l1 - delta; i++) {
            mas[num]=arr[i][column];
            num++;
        }

        row = l1 - delta - 1;
        for (let i = column - 1; i > delta; i--) {
            mas[num]=arr[row][i];
            num++;
        }

        column = delta;
        for (let i = row; i > delta; i--) {
            mas[num]=arr[i][column];
            num++;
        }
        delta++;
        k--;
    }
    return mas;
}