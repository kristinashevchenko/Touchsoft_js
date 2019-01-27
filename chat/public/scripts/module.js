"use strict"
/**This module contains main function of chat*/
const Chat = (function () {
    var images = ["images/show_chat.png", "images/close_chat.png"];

    var state = 0, user = "Anonym";
    var socket = io("http://localhost:1800/");
    var obj = {};
    var showD;
    var reqF;
    var commands = [];
    var bot = true;
    return {
        /**This is @constructor for chat*/
        TSChat: function (obj) {
            startFunc(obj);
        },
        /**Returns user*/
        getUser: function () {
            return user;
        },
        /**Set user*/
        setUser: function (us) {
            user = us;
        },
        /**Set state*/
        setState: function (st) {
            state = st;
        },
        /**Returns state*/
        getState: function () {
            return state;
        },
        /**Returns bot*/
        getBot: function () {
            return bot;
        },
        /**Returns true if bot name required*/
        getRequireName: function () {
            return obj.requireName;
        },
        /**Check not done commands for user*/
        checkModal: function () {
            checkCommand().then(res => {
                if (res) {
                    for (let j = 0; j < res.length; j++) {
                        if (res.name === "Modal")
                            createModalDialog(res[j]);
                        else {
                            createServiceReq(res[j]);
                        }
                    }
                }
            });
        },
    }

    /**Start function, which create DOM-model of chat*/
    function startFunc(obj2) {
        for (var key in obj2) {
            obj[key] = obj2[key];
        }
        showD = obj2.showDataTime;
        reqF = obj2.requests;
        initConfig(obj2);
        let link2 = document.createElement("link");
        link2.setAttribute("rel", "stylesheet");
        link2.setAttribute("href", "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css");
        link2.setAttribute("integrity", "sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO");
        link2.setAttribute("crossorigin", "anonymous");
        document.head.appendChild(link2);
        let link1 = document.createElement("link");
        link1.setAttribute("href", "../style/style.css");
        link1.setAttribute("rel", "stylesheet");
        document.head.appendChild(link1);

        let chat_box = document.createElement("div");
        let chat_class = obj.position === "Left" ? "chat-box-left" : "chat-box-right";
        chat_box.setAttribute("class", "chat-box " + chat_class);

        let head_box = document.createElement("div");
        head_box.setAttribute("class", "open " + obj.cssClass === undefined ? "violet" : obj.cssClass);

        let img_replace = document.createElement("img");
        img_replace.setAttribute("src", "images/cross.png");
        img_replace.setAttribute("title", "Replace");
        img_replace.className = "img_box";

        if (obj.allowDrag)
            img_replace.onmousedown = function (e) {
                if (e.target === e.currentTarget) {
                    moveAt(e);
                }

                function moveAt(e) {
                    chat_box.style.left = e.pageX + 'px';
                    chat_box.style.top = e.pageY + 'px';
                }

                document.onmousemove = function (e) {
                    moveAt(e);
                }
                head_box.onmouseup = function () {
                    document.onmousemove = null;
                    img_replace.onmouseup = null;
                }
            }
        let img_registration = document.createElement("img");
        img_registration.setAttribute("src", "images/login.png");
        img_registration.className = "img_registr";
        img_registration.addEventListener("click", clickRegistr);

        let chat_text = document.createElement("span");
        chat_text.className = "chat_text";
        chat_text.textContent = obj.title === undefined ? "Chat: Anonym" : obj.title + ": Anonym";

        let img_box = document.createElement("img");
        img_box.setAttribute("src", "images/show_chat.png");
        img_box.className = "img_box";
        if (obj.allowMinimize)
            img_box.addEventListener("click", showChat);

        let box_img_cancel = document.createElement("img");
        box_img_cancel.setAttribute("src", "images/cancel_chat.png");
        box_img_cancel.className = "img_box";
        box_img_cancel.addEventListener("click", function () {
            chat_box.classList.add("hideForm");
        });
        let box = document.createElement("div");
        box.setAttribute("class", "box");
        let messages = document.createElement("textarea");
        messages.setAttribute("class", "messages");
        messages.setAttribute("readonly", true);
        let form = document.createElement("form");
        form.setAttribute("class", "hideForm form_chat");
        form.setAttribute("onsubmit", "return false");
        let container = document.createElement("div");
        container.className = "form-row align-items-center";
        let cont_textarea = document.createElement("div");
        cont_textarea.className = "col-auto";
        let message = document.createElement("textarea");
        message.className = "form-control mb-2";
        message.setAttribute("id", "inlineFormInput");
        message.setAttribute("placeholder", "Пользовательское сообщение");
        message.setAttribute("rows", "5");
        message.setAttribute("cols", "30");
        message.setAttribute("type", "text");
        let cont_button = document.createElement("div");
        cont_button.className = "col-auto";
        let button = document.createElement("button");
        button.setAttribute("type", "submit");
        button.setAttribute("class", "btn btn-primary mb-2");
        button.textContent = "Send";
        let button_choose = document.createElement("button");
        button_choose.addEventListener("click", showUsers);
        button_choose.setAttribute("class", "btn btn-primary mb-2");
        button_choose.setAttribute("type", "text");
        button_choose.textContent = "Choose";
        cont_button.appendChild(button);
        cont_textarea.appendChild(message);
        container.appendChild(cont_textarea);
        container.appendChild(cont_button);
        container.appendChild(button_choose);
        form.appendChild(container);
        box.appendChild(messages);
        box.appendChild(form);
        head_box.appendChild(img_registration);
        head_box.appendChild(chat_text);
        head_box.appendChild(img_box);
        head_box.appendChild(img_replace);
        head_box.appendChild(box_img_cancel);
        head_box.appendChild(box);
        chat_box.appendChild(head_box);
        document.body.appendChild(chat_box);

        if (reqF) {
            let str = "http://localhost:1800/state";
            str += "?username=" + user;
            fetch(str).then(function (response) {
                    response.json().then(function (res) {
                        res == false ? state = 1 : state = 0;
                        console.log("state", state, res);
                        if (!obj.allowMinimize)
                            state = 0;
                        showChat();
                    });
                }
            )
                .catch(function (err) {
                    console.log('Fetch Error :-S', err);
                });
            str = "http://localhost:1800/value?username=" + user + "&bot=true";
            fetch(str).then(function (response) {
                response.json().then(res => {
                    document.querySelector(".messages").value = res;
                });
            });
        }
        else {
            checkState().then(res => {
                res == false ? state = 1 : state = 0;
                console.log("state", state, res);
                if (!obj.allowMinimize)
                    state = 0;
                showChat();
            });
            checkStr().then(res => {
                document.querySelector(".messages").value = res;
            });
        }
        document.querySelector("form").addEventListener("submit", submitForm.bind(null, showD));

        createRegistartionForm();
        if (obj.requireName) {
            clickRegistr();
        }
        socket.on("new command operator", function (data) {
            if (data.username === user) {
                console.log(data);
                if (data.command.name === "Modal") {
                    createModalDialog(data.command);
                } else if (data.command.name === "Service") {
                    createServiceReq(data.command);
                }
            }
        });
        socket.on("new message operator", function (data) {
            if(!bot&&user===data.username)
            document.querySelector(".messages").value += data.str;
        });
    }

    /**Make request for user ip and sends it on server*/
    function createServiceReq(data) {
        let str;
        switch (data.params[0]) {
            case "ipinfo":
                str = "https://ipinfo.io/json";
                break;
            case "ip-api":
                str = "http://ip-api.com/json/?fields=country,city,lat,lon,query";
                break;
            case "geoip-db":
                str = "https://geoip-db.com/json/";
                break;
        }
        getXmlRequest(str).then(res => {
            let res2 = "Country ";
            res2 += res.country ? res.country : res.country_name;
            res2 += " City ";
            res2 += res.city ? res.city : "unknown";
            res2 += " Location ";
            res2 += (res.loc ? res.loc : (res.lat ? res.lat + "," + res.lon : res.latitude + "," + res.longitude));
            res2 += " IP ";
            res2 += (res.ip ? res.ip : (res.query ? res.query : res.IPv4));
            const obj = {
                username: user,
                command: true,
                str: res2,
                id2: data.id2,
            };
            socket.emit("message", obj);
        });
    }

    /**Create modal dialog*/
    function createModalDialog(data) {
        let div3, div4, div5, div6;

        div3 = document.createElement("div");
        div3.className = "modal-content modalList";
        div4 = document.createElement("div");
        div4.className = "modal-header";

        let h5 = document.createElement("h5");
        h5.className = "modal-title";
        h5.textContent = data.params[0];

        div5 = document.createElement("div");
        div5.className = "modal-body";

        let form_reg = document.createElement("form");
        let divf1, label1, input1;
        divf1 = document.createElement("div");
        divf1.className = "form-group";
        label1 = document.createElement("label");
        label1.textContent = data.params[1];

        input1 = document.createElement("input");
        input1.className = "form-control";
        input1.setAttribute("type", "email");
        input1.setAttribute("placeholder", data.params[2]);
        divf1.appendChild(label1);
        divf1.appendChild(input1);

        form_reg.appendChild(divf1);
        div5.appendChild(form_reg);
        div6 = document.createElement("div");

        let button_ok = document.createElement("button");
        button_ok.setAttribute("type", "submit");
        button_ok.setAttribute("class", "btn btn-primary");
        button_ok.textContent = "OK";
        button_ok.addEventListener("click", function () {
            let str = input1.value;
            const obj = {
                username: user,
                command: true,
                str: input1.value,
                id2: data.id2,
            };
            socket.emit("message", obj);
            document.body.removeChild(div3);
        });

        div4.appendChild(h5);
        div6.appendChild(button_ok);
        div3.appendChild(div4);
        div3.appendChild(div5);
        div3.appendChild(div6);
        document.body.appendChild(div3);
    }

    /**Show histrory messages*/
    function showUsers(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        document.querySelector(".messages").value = "";
        bot = !bot;
        console.log(bot);
        if (!bot) {
            let str = "http://localhost:1800/operator?username=" + user;
            fetch(str).then(function (response) {
                response.json().then(res => {
                    document.querySelector(".messages").value = res.operator;
                });
            });
        } else {
            checkStr().then(res => {
                document.querySelector(".messages").value = res;
            });
        }
    }

    /**Show/hide chat*/
    function showChat() {
        state = !state;
        document.querySelector(".img_box").setAttribute("src", images[+state]);
        if (+state === 0) {
            document.querySelector(".form_chat").classList.add("hideForm");
            document.querySelector(".box").classList.remove("open-clicked");
        }
        else {
            document.querySelector(".form_chat").classList.remove("hideForm");
            document.querySelector(".box").classList.add("open-clicked");
        }
        checkState(state).then(res => {
        });
    }

    /**Send configuration parametres on server*/
    function initConfig() {
        const json = JSON.stringify({
            botName: obj.botName,
            showDataTime: obj.showDataTime,
        });
        if (reqF) {
            return fetch("http://localhost:1800/config", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: json
            });
        }
        else {
            return new Promise((resolve, reject) => {
                const xmlhttp = new XMLHttpRequest();
                xmlhttp.open("POST", ("http://localhost:1800/config"), true);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                xmlhttp.onload = function () {
                    if (xmlhttp.status === 200) {
                        resolve(xmlhttp.responseText);
                    } else reject();
                };
                xmlhttp.send(json);
            })
        }
    }

    /**Show registration form*/
    function clickRegistr() {
        document.querySelector("#regForm").classList.remove("hideForm");
    }

    /**Check state of chat*/
    function checkState(param) {
        let str = "http://localhost:1800/state";
        str += "?username=" + user;
        if (param !== undefined) {
            str += "&state=" + (+param);
        }
        return getXmlRequest(str);
    }

    /**Check users's commangs*/
    function checkCommand() {
        let str = "http://localhost:1800/command?username=" + user;
        return getXmlRequest(str);
    }

    /**Check messages of user*/
    function checkStr() {
        let str = "http://localhost:1800/value?username=" + user + "&bot=true";
        return getXmlRequest(str);
    }

    /**Template for get-request*/
    function getXmlRequest(str) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", str, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                }
                else reject();
            };
            xhr.send(null);
        });
    }

    /**Create registration modal dialog*/
    function createRegistartionForm() {
        let div3, div4, div5, div6;

        div3 = document.createElement("div");
        div3.className = "modal-content";
        div3.setAttribute("id", "regForm");
        div4 = document.createElement("div");
        div4.className = "modal-header";

        let h5 = document.createElement("h5");
        h5.className = "modal-title";
        h5.textContent = "Registartion form";
        let sign_close = document.createElement("button");
        sign_close.setAttribute("type", "button");
        sign_close.setAttribute("class", "close");
        sign_close.setAttribute("data-dismiss", "modal");
        sign_close.setAttribute("aria-label", "Close");

        let span = document.createElement("span");
        span.setAttribute("aria-hidden", true);

        div5 = document.createElement("div");
        div5.className = "modal-body";

        let form_reg = document.createElement("form");
        let divf1, divf2, label1, label2, input1, input2;
        divf1 = document.createElement("div");
        divf1.className = "form-group";

        divf2 = document.createElement("div");
        divf2.className = "form-group";

        label1 = document.createElement("label");
        label1.setAttribute("for", "exampleInputEmail1");
        label1.textContent = "Login";

        label2 = document.createElement("label");
        label2.setAttribute("for", "exampleInputPassword1");
        label2.textContent = "Password";

        input1 = document.createElement("input");
        input1.className = "form-control";
        input1.setAttribute("type", "email");
        input1.setAttribute("id", "exampleInputEmail1");
        input1.setAttribute("aria-describedby", "emailHelp");
        input1.setAttribute("placeholder", "Enter login");

        input2 = document.createElement("input");
        input2.className = "form-control";
        input2.setAttribute("type", "password");
        input2.setAttribute("id", "exampleInputPassword1");
        input2.setAttribute("placeholder", "Enter password");

        divf1.appendChild(label1);
        divf1.appendChild(input1);
        divf2.appendChild(label2);
        divf2.appendChild(input2);
        form_reg.appendChild(divf1);
        form_reg.appendChild(divf2);
        div5.appendChild(form_reg);

        div6 = document.createElement("div");

        let button_close = document.createElement("button");
        button_close.setAttribute("type", "button");
        button_close.setAttribute("class", "btn btn-secondary");
        button_close.setAttribute("data-dismiss", "modal");
        button_close.textContent = "Close";
        button_close.addEventListener("click", function () {
            if (obj.requireName && user === "Anonym") {
            }
            else document.querySelector("#regForm").classList.add("hideForm");
        });

        let button_ok = document.createElement("button");
        button_ok.setAttribute("type", "submit");
        button_ok.setAttribute("class", "btn btn-primary");
        button_ok.textContent = "OK";
        button_ok.addEventListener("click", registerReq);

        sign_close.appendChild(span);
        div4.appendChild(h5);
        div4.appendChild(sign_close);
        div6.appendChild(button_close);
        div6.appendChild(button_ok);
        div3.appendChild(div4);
        div3.appendChild(div5);
        div3.appendChild(div6);
        div3.classList.add("hideForm");
        document.body.appendChild(div3);
    }
})();