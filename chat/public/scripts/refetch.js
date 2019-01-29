/**This file contains function for socket-connection*/
var images = ["images/show_chat.png", "images/close_chat.png"];
var socket = io("http://localhost:1800/");
/**Catching new user messages
 * @param {Object} data contains:
 * username,new message*/
socket.on("new message", function (data) {
    if (Chat.getBot() && Chat.getUser() === data.username)
        document.querySelector(".messages").value += data.str;
});

/**Catching new users
 * @param {Object} user2 contains:
 * username,state of dialog,history dialog,window id,*/
socket.on("new user", function (user2) {
    if (user2.username === "Anonym" && Chat.getRequireName()) {
        clickRegistr();
    }
    else if (user2.windowId === Chat.getWindowId()) {
        Chat.setUser(user2.username);
        Chat.setState(+user2.state);
        document.querySelector(".chat_text").textContent = "Chat: " + user2.username;
        if(Chat.getBot())
        document.querySelectorAll("textarea").item(0).value = user2.dialog;
        else{
            document.querySelectorAll("textarea").item(0).value = user2.operator;
        }
        Chat.checkModal();
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
});
Chat.checkModal();

/**Show registration window and send user on server*/
function registerReq() {
    document.querySelector("#regForm").classList.add("hideForm");
    const obj = {
        username: document.getElementById("exampleInputEmail1").value,
        password: document.getElementById("exampleInputPassword1").value,
        state: Chat.getState(),
        windowId: Chat.getWindowId(),
    };
    document.getElementById("exampleInputEmail1").value = "";
    document.getElementById("exampleInputPassword1").value = "";
    socket.emit("authorize", obj);
}

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
    document.querySelector(".messages").value += str;
    socket.emit("message", obj);
    textarea.value = "";
}