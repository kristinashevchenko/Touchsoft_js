function createForm() {
    let form = document.createElement("form");
    let div1 = document.createElement("div");
    div1.textContent = "Name: ";
    let div2 = document.createElement("div");
    div2.textContent = "Age: ";
    let div3 = document.createElement("div");
    div3.textContent = "Gender: ";
    let div4 = document.createElement("div");
    div4.textContent = "Driver lisence";
    let div5 = document.createElement("div");
    div5.textContent = "About me: ";
    let div_s1 = document.createElement("label");
    div_s1.textContent = "Female";
    let div_s2 = document.createElement("label");
    div_s2.textContent = "Male";
    let name = document.createElement("input");
    name.setAttribute("type", "text");
    name.setAttribute("required", "true");
    let age = document.createElement("select");
    age.setAttribute("required", "true");
    for (let i = 0; i < 101; i++) {
        let option = document.createElement("option");
        option.textContent = i;
        age.appendChild(option);
    }
    let s1 = document.createElement("input");
    s1.setAttribute("type", "radio");
    s1.setAttribute("value", "female");
    s1.setAttribute("name", "r1");
    let s2 = document.createElement("input");
    s2.setAttribute("type", "radio");
    s2.setAttribute("value", "male");
    s2.setAttribute("checked", "true");
    s2.setAttribute("name", "r1");
    let driver_l = document.createElement("input");
    driver_l.setAttribute("type", "checkbox");
    let about_me = document.createElement("textarea");
    about_me.setAttribute("required", "true");
    let button = document.createElement("input");
    button.setAttribute("type", "submit");
    button.setAttribute("value", "OK");
    form.addEventListener("submit", sendInform);
    form.setAttribute("onsubmit", "return false");
    div1.appendChild(name);
    div2.appendChild(age);
    div3.appendChild(s1);
    div3.appendChild(div_s1);
    div3.appendChild(s2);
    div3.appendChild(div_s2);
    div4.appendChild(driver_l);
    div5.appendChild(about_me);
    form.appendChild(div1);
    form.appendChild(div2);
    form.appendChild(div3);
    form.appendChild(div4);
    form.appendChild(div5);
    form.appendChild(button);
    document.getElementsByClassName("container2").item(0).appendChild(form);
}

function sendInform() {
    let form = document.forms[0];
    let information = document.getElementById("result");
    information.hidden = false;
    information.innerHTML = "";
    information.setAttribute("rows", 8);
    information.setAttribute("cols", 30);
    let objSel = form.getElementsByTagName("select")[0];
    let str = "Name: " + form.getElementsByTagName("input")[0].value;
    str = str + "\nAge: " + objSel.options[objSel.selectedIndex].value;
    if (form.getElementsByTagName("input")[1].checked) {
        str = str + "\nGender: Female";
    }
    else {
        str += "\nGender: Male";
    }
    let dr_l = false;
    if (form.getElementsByTagName("input")[3].checked)
        dr_l = true;
    str = str + "\nDriver lisence: " + dr_l;
    str = str + "\nAbout me: " + form.getElementsByTagName("textarea")[0].value;
    information.value = str;
    document.getElementsByClassName("container2").item(0).appendChild(information);
}

createForm();

function drawCalendar(year, month, htmlEl) {
    let box=document.getElementById("box");

    Promise.resolve(localStorage.getItem("box"))
        .then((str2)=>{
            if(str2!=null)
        box.value=str2;
            else
                localStorage.setItem("box","");
    });


    let monthes = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month2 = month - 1;
    let date = new Date(year, month2);
    let table = document.createElement("table");
    let mon_name = document.createElement("div");
    let img_left = document.createElement("img");
    img_left.setAttribute("src", "left.png");
    img_left.addEventListener("click", recentMonth.bind(null, month, year, mon_name));
    mon_name.appendChild(img_left);
    let month_year = document.createElement("span");
    month_year.textContent = monthes[month2] + " " + year;
    mon_name.appendChild(month_year);
    let img_right = document.createElement("img");
    img_right.setAttribute("src", "right.png");
    mon_name.appendChild(img_right);
    img_right.addEventListener("click", nextMonth.bind(null, month, year, mon_name));
    for (let i = 0; i < getNumberDay(date); i++) {
        table.appendChild(document.createElement("td"));
    }
    while (date.getMonth() == month2) {
        let td = document.createElement("td");
        td.textContent = date.getDate();
        td.addEventListener("click",dateClicked.bind(null,month,year,mon_name));
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

drawCalendar(2018, 11, document.getElementById("calendar"));

function recentMonth(month, year, htmlEl) {
    if (month === 1) {
        month = 12;
        year--;
    }
    else {
        month -= 1;
    }
htmlEl.innerHTML = "";
drawCalendar(year, month, htmlEl);
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
    drawCalendar(year, month, htmlEl);
}

function dateClicked(month,year,htmlEl){
    let el=event.currentTarget;
    let str=el.textContent+"."+month+"."+year+" : ";
    str+=prompt("Please,describe date.");
    str+="\n";
    document.getElementById("box").value+=str;
    Promise.resolve(localStorage.getItem("box")).then((str2)=>{
        str2+=str;
        localStorage.setItem("box",str2);
    });

}