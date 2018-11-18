/* eslint no-var: "off" */
/* eslint no-unused-vars: "off" */

/* eslint max-len: "off" */

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
        else if (isNaN(objA) && isNaN(objB)) {
            return true;
        }
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
        else if (objA[arrA[i]] === objA || objA[arrA[i]] === objB) {
            continue;
        }
        else if (!isDeepEqual(objA[arrA[i]], objB[arrB[i]])) {
            return false;
        }
    }
    return true;
}

/**
 * Функция фиксации контекста
 * @param {*} func Функция для которой нужно зафиксировать контекст
 * @param {*} context значение для this
 * @return {function} функция с зафиксированным контекстом
 */

function bind(func,context) {
    let args = [].slice.call(arguments, 2);
    console.log(args);
    return function() {
        let func_args = [].slice.call(arguments);
        return func.apply(context,args.concat(func_args));
    };
}

/**
 * Реализовать метод .myBind для всех функций,
 * который работает так же как оригинальный .bind но не использует его внутри
 * (можно использовать фукнцию выше)
 */
Function.prototype.myBind=function(context){
    let func=this;
    let args = [].slice.call(arguments, 1);
    return function() {
        let func_args = [].slice.call(arguments);
        return func.apply(context,args.concat(func_args));
    };
};

Function.prototype.myCall=function(context){
    return this.apply(context,[].slice.call(arguments, 1));
};
/**
 * создать объект с волшебным свойством,
 * чтобы при присвоении ему значения, в консоль выводилась текущая дата и значение, которое присваиваем.
 * А при чтении всегда выводилось число на 1 больше предыдущего
 * o.magicProperty = 5; // 'Sat Mar 24 2018 13:48:47 GMT+0300 (+03) -- 5'
 * console.log(o.magicProperty); // 6
 * console.log(o.magicProperty); // 7
 * console.log(o.magicProperty); // 8
 */

let o = {
    property: 0,
    get magicProperty() {
        this.property += 1;
        console.log(this.property);
    },
    set magicProperty(property) {
        this.property = property;
        console.log(new Date());
        console.log(this.property);
    },
};


/**
 * Создать конструктор с методами, так,
 * чтобы следующий код работал и делал соответствующие вещи
 * те запуск кода ниже должен делать то, что говорят методы
 * u.askName().askAge().showAgeInConsole().showNameInAlert();
 */
function Ask() {
    this.name = null;
    this.age = 0;
}

Ask.prototype.askName = function () {
    this.name = prompt('What is your name?', "Kristina");
    return this;
};
Ask.prototype.askAge = function () {
    this.age = prompt('How old are you?', 25);
    return this;
};
Ask.prototype.showAgeInConsole = function () {
    console.log("Your age is ", this.age);
    return this;
};
Ask.prototype.showNameInAlert = function () {
    alert("Your name is " + this.name);
    return this;
};
let u = new Ask();

//u.askName().askAge().showAgeInConsole().showNameInAlert();


/**
 * Написать фукнцию-калькулятор, которая работает следующим образом
 * calculate('+')(1)(2); // 3
 * calculate('*')(2)(3); // 6
 * Допустимые операции : + - * /
 */
function calculate(sign){
    return function(first) {
        return function(second) {
            switch (sign) {
                case "+":
                    return first+second;
                    break;
                case "-":
                    return first-second;
                    break;
                case "*":
                    return first*second;
                    break;
                case "/":
                    return first/second;
                default:
                    break;
            }
        };
    };
}

/**
 * Создайте конструктор-синглтон? Что такое синглтон?
 * new Singleton() === new Singleton
 */
function Singleton() {
    if (Singleton.inst) {
        return Singleton.inst;
    }
    Singleton.inst = this;
    return Singleton.inst;
}

/**
 * Создайте функцию ForceConstructor
 * которая работает как конструктор независимо от того,
 * вызвана она с new или без
 * и сохраняет параметры в создаваемый объект с именами параметров
 */
function ForceContructor(a, b, c) {
    if (!(this instanceof ForceContructor)) return new ForceContructor(a, b, c);
    this.a = a;
    this.b = b;
    this.c = c;


}


/**
 * Написать фукнцию сумматор, которая будет работать
 * var s = sum();
 * log(s); // 0
 * log(s(1)); // 1
 * log(s(1)(2)); //3
 * log(s(3)(4)(5)); // 12
 * Число вызовов может быть неограниченым
 */
function sum(a) {
    let currentSum;
    var startSum = 0;
    if(a)
        startSum = a;
    currentSum=startSum;
    function f(b) {
        if(b)
            currentSum += b;
        return f;
    }
    f.valueOf = function() {
        let temp=currentSum;
        currentSum=startSum;
        return temp;
    };
    return f;
}

function log(x) {
    console.log(+x);
}

/**
 * Написать каррирующую функцию и покрыть ее тестами
 * Функция должна поддерживать каррирование функций с 2,3,4,5 параметрами
 * пример работы  функции
 *
 * function target1(a,b,c,d) { return a + b + c + d }
 * function target2(a,b) { return a + b }
 * curry(target1)(1)(2)(3)(4) // 10
 * curry(target2)(5)(8) // 13
 *
 * Примеры тестов смотреть в файле тестов
 *
 * Читать
 * http://prgssr.ru/development/vvedenie-v-karrirovanie-v-javascript.html
 * https://github.com/MostlyAdequate/mostly-adequate-guide-ru/blob/master/ch4-ru.md
 * @param {*} func
 */
function curry(func) {
    return function(first) {
        return function(second) {
            if(func.name==="sum2")
                return func.call(this,first,second);
            return function(third) {
                return function(forth){
                    return func.call(this,first,second,third,forth);
                };
            };
        };
    };
}

/*
Написать код, который для объекта созданного с помощью конструктора будет показывать, 
что объект является экземпляром двух классов
*/
function User(){}
function PreUser(){}
PreUser.prototype=Object.create(Array.prototype);
User.prototype=Object.create(PreUser.prototype);
// User === PreUser; // false
// u instanceof User; // true
// u instanceof Array; // true
// u instanceof PreUser; // true

/*
Создать веб страницу. Добавить на нее форму с полями 
- имя (строкое поле), 
- родной город (Выпадающий список), 
- Комментарий (многострочное поле), пол (radiobutton). 
При нажатии на кнопку - нужно собрать данные введенные в поля и вывести их в блоке под формой, 
после чего поля очистить.
*/

/* 
Используя функцию drawCalendar из прошлого урока
создать функцию drawInteractiveCalendar(el)
Которая выводит календарь, в шапке которого отображается
[<] месяц / год [>]
При клике по кнопкам [<] / [>] нужно реализовать листание календаря
Добавть на страницу index.html вызов календаря
*/
function drawInteractiveCalendar(year, month, htmlEl) {
    let monthes = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month2 = month - 1;
    let date = new Date(year, month2);
    let table = document.createElement("table");
    let mon_name = document.createElement("div");
    let img_left = document.createElement("img");
    img_left.setAttribute("src", "left.png");
    img_left.setAttribute("height", "20px");
    img_left.setAttribute("width", "20px");
    img_left.addEventListener("click", recentMonth.bind(null, month, year, mon_name));
    mon_name.appendChild(img_left);
    let month_year = document.createElement("span");
    month_year.textContent = monthes[month2] + " " + year;
    mon_name.appendChild(month_year);
    let img_right = document.createElement("img");
    img_right.setAttribute("src", "right.png");
    img_right.setAttribute("height", "20px");
    img_right.setAttribute("width", "20px");
    mon_name.appendChild(img_right);
    img_right.addEventListener("click", nextMonth.bind(null, month, year, mon_name));
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
    return mon_name;
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

function recentMonth(month, year, htmlEl) {
    if (month === 1) {
        month = 12;
        year--;
    }
    else {
        month -= 1;
    }
    htmlEl.innerHTML = "";
    drawInteractiveCalendar(year, month, htmlEl);
}

function nextMonth(month, year, htmlEl) {
    if (month === 12) {
        month = 1;
        year++;
    }
    else {
        month += 1;
    }
    htmlEl.innerHTML = "";
    drawInteractiveCalendar(year, month, htmlEl);
}

/**
 создать синхронную функцию sleep(seconds) так, чтобы работал код
 console.log(new Date()); // Sat Nov 17 2018 20:45:34 GMT+0300
 sleep(9);
 console.log(new Date()); // Sat Nov 17 2018 20:45:43 GMT+0300
 */

function sleep(time) {
    let t = time * 1000;
    let start = new Date().getTime();
    while (new Date().getTime() < start + t) {
    }
}

/**
 Написать функцию getCounter и покрыть ее тестами, так, чтобы работал следующий код
 var c = getCounter(5);
 c
 .log() // 5
 .add(4)
 .log() // 9
 .add(3)
 .log() // 12
 .reset()
 .log() // 0
 .add(8)
 .log(); // 8
 */

function getCounter(count){
    if (!(this instanceof getCounter)) return new getCounter(count);
    if(count) {
        this.counter = count;
    }else{
        this.counter=0;
    }
}
getCounter.prototype.reset=function(){
    this.counter=0;
    return this;
};
getCounter.prototype.add=function(num){
    this.counter+=num;
    return this;
};
getCounter.prototype.log=function(){
    console.log(this.counter);
    return this;
};

/**
 создать функцию,
 которая не может работать как конструктор
 (работать с new), и покрыть ее тестами
 */
function F(){
    if(this instanceof F){
        throw new Error("Can't use F with new");
    }
}


function throttle(fun, delay) {
    var isThr = false, thrArgs, thrThis;
    function temp() {
        if (isThr) {
            thrArgs = arguments;
            thrThis = this;
            return;
        }
        fun.apply(this, arguments);
        isThr = true;
        setTimeout(function() {
            isThr= false;
            if (thrArgs) {
                temp.apply(thrThis, thrArgs);
                thrArgs = thrThis = null;
            }
        }, delay);
    }
    return temp;
}

