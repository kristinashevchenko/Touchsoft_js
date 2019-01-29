/**Module contains functions for longpolling*/
var images = ["images/show_chat.png", "images/close_chat.png"];
var wasBot;
Chat.checkModal();

/**Function send user messages on server
 * @param {Boolean} showD means if it's needed to show date/time*/
function submitForm(showD) {
    let date = new Date();
    let textarea = document.querySelectorAll("textarea").item(1);
    let str;
    let strU = "Вы: ";
    if (!Chat.getBot()) strU = Chat.getUser() + ": ";
    if (showD) {
        str = date.getHours() + ":" + date.getMinutes() + strU + textarea.value + "\n";
    }
    else {
        str = strU + textarea.value + "\n";
    }
    const obj = {
        username: Chat.getUser(),
        value: textarea.value,
        str: str,
        bot: Chat.getBot(),
    };
    wasBot=Chat.getBot();
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", ("http://localhost:1800/value?username" + Chat.getUser()), true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onload = function () {
        console.log("OK");
    };
    xmlhttp.send(JSON.stringify(obj));
    textarea.value = "";
}

subscribe();

/**Function send request on server and wait for changes*/
function subscribe() {
    let str = "http://localhost:1800/subscribe?username=" + Chat.getUser() + "&bot=" + Chat.getBot();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", str, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(xhr.statusText);
            if(wasBot===Chat.getBot())
            document.querySelector(".messages").value = JSON.parse(xhr.responseText);
            subscribe();
        }
        else {
            setTimeout(subscribe, 500);
        }
    };
    xhr.send(null);
}

/**Registration of users and authorization*/
function registerReq() {
    document.querySelector("#regForm").classList.add("hideForm");
    const obj = {
        username: document.getElementById("exampleInputEmail1").value,
        password: document.getElementById("exampleInputPassword1").value,
        state: Chat.getState(),
    };
    document.getElementById("exampleInputEmail1").value = "";
    document.getElementById("exampleInputPassword1").value = "";
    let str = "http://localhost:1800/authorize?username=" + obj.username + "&password=" + obj.password + "&state=" + obj.state;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", str, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            let user2 = JSON.parse(xhr.responseText, function (key, value) {
                if (key == 'state') return new Boolean(value);
                return value;
            });

            if (user2.username === "Anonym" && Chat.getRequireName()) {
                clickRegistr();
            }
            else {
                Chat.setUser(user2.username);
                Chat.setState(+user2.state);
                Chat.checkModal();
                document.querySelector(".chat_text").textContent = "Chat: " + user2.username;
                if(Chat.getBot())
                    document.querySelectorAll("textarea").item(0).value = user2.dialog;
                else{
                    document.querySelectorAll("textarea").item(0).value = user2.operator;
                }
                document.querySelector(".img_box").setAttribute("src", images[+user2.state]);
                if (+user2.state === 0) {
                    document.querySelector(".form_chat").classList.add("hideForm");
                    document.querySelector(".box").classList.remove("open-clicked");
                }
                else {
                    document.querySelector(".form_chat").classList.remove("hideForm");
                    document.querySelector(".box").classList.add("open-clicked");
                }
            }
        }
    };
    xhr.send(null);
}