/**This module contains function for operator page*/
const Operator = (function () {
    let socket = io("http://localhost:1800/");
    let users = [];
    let user;
    checkUsers();
    /**Catching new users*/
    socket.on("new user", function (user2) {
        let list = document.querySelector("#selectUsers");
        let exist = false;
        for (let i = 0; i < list.length; i++) {
            if (list[i] === user2.username) {
                exist = true;
            }
        }
        if (!exist) {
            let option = document.createElement("option");
            option.textContent = user2.username;
            users.push({username: user2.username, state: user2.state});
            list.appendChild(option);
        }
    });
    /**Catching new messages from users*/
    socket.on("new message user", function (data) {
        console.log("here",data.username);
        if (data.username === user) {
            document.getElementById("messages").value += data.str;
        }

    });
    /**Catching new commands*/
    socket.on("new command user", function (data) {
        if (data.username === user)
            document.getElementById("logOper").value += data.str;
    });

    /**Function add listeners on elements and make request on server for information about users*/
    function checkUsers() {

        document.getElementById("sortUs").addEventListener("change", sortUsers);
        document.getElementById("selectUsers").addEventListener("click", showRightCol);
        document.getElementById("filterUsers").addEventListener("input", filterUsers);
        document.getElementById("runCode").addEventListener("click", runCode);
        document.getElementById("operCommand").addEventListener("click", showParams);
        document.getElementById("sendMessageForm").addEventListener("submit", submitForm);

        document.getElementById("close").addEventListener("click", function () {
            document.getElementsByClassName("right-column").item(0).classList.add("hideForm")
        });
        let str = "http://localhost:1800/users";
        fetch(str).then(function (response) {
            response.json().then(res => {
                console.log(res);
                let list = document.getElementById("selectUsers");
                list.innerHTML = "";
                users = [];
                let option;
                for (let i = 0; i < res.length; i++) {
                    option = document.createElement("option");
                    option.textContent = res[i].username;
                    users.push({username: res[i].username, state: res[i].state});
                    list.appendChild(option);
                }
            });
        });
    }

    /**Function filter users according to string in input*/
    function filterUsers() {
        let str = document.getElementById("filterUsers").value;
        if (str) {
            let newUsers = users.filter(function (user) {
                return user.username.indexOf(str, 0) === -1 ? false : true;
            });
            let list = document.getElementById("selectUsers");
            list.innerHTML = "";
            let option;
            for (let i = 0; i < newUsers.length; i++) {
                option = document.createElement("option");
                option.textContent = newUsers[i].username;
                list.appendChild(option);
            }
        }
        else {
            checkUsers();
        }
    }

    /**Function show dialog of selected user and operator, control panel with results of commands*/
    function showRightCol() {
        document.getElementsByClassName("right-column").item(0).classList.remove("hideForm");
        user = document.getElementById("selectUsers").value;
        document.getElementById("messages").value = "";
        document.getElementById("logOper").value = "";
        document.getElementById("param1").value = "";
        document.getElementById("param2").value = "";
        document.getElementById("param3").value = "";
        let str = "http://localhost:1800/operator?username=" + user;
        fetch(str).then(function (response) {
            response.json().then(res => {
                document.getElementById("messages").value = res.operator;
                let arr = res.command;
                let str;
                for (let i = 0; i < arr.length; i++) {
                    str = arr[i].date + " " + arr[i].name + "(";
                    for (let j = 0; j < arr[i].params.length; j++) {
                        str += (arr[i].params[j] + ",");
                    }
                    str += ") - " + arr[i].result + "\n";
                    document.getElementById("logOper").value += str;
                }
            });
        });
        document.getElementById("activeUser").textContent = "Active: " + document.getElementById("selectUsers").value;
    }

    function showParams() {
        if (document.getElementById("operCommand").value === "Modal") {
            document.getElementById("paramCommand").classList.remove("hideForm");
            document.getElementById("servCommand").classList.add("hideForm");
        } else {
            document.getElementById("servCommand").classList.remove("hideForm");
            document.getElementById("paramCommand").classList.add("hideForm");
        }
    }

    /**Function sorts by ascending of names*/
    function sortNames(a, b) {
        if (a.username > b.username)
            return 1;
        else if (a.username < b.username)
            return -1;
        else return 0;
    }

    /**Function sorts by ascending of states*/
    function sortStates(a, b) {
        return a.state - b.state;
    }

    /**Function sorts users according to selected value*/
    function sortUsers() {
        let select = document.getElementById("sortUs");
        let value = select.value;
        if (value === "Name") {
            users.sort(sortNames);
        } else {
            users.sort(sortStates);
        }
        let list = document.getElementById("selectUsers");
        list.innerHTML = "";
        let option;
        for (let i = 0; i < users.length; i++) {
            option = document.createElement("option");
            option.textContent = users[i].username;
            list.appendChild(option);
        }
    }

    /**Function send request with command on server*/
    function runCode() {
        const obj = {
            username: user,
            command: {
                name: document.getElementById("operCommand").value,
                params: [document.getElementById("param1").value, document.getElementById("param2").value,
                    document.getElementById("param3").value],
            },
        };
        if (obj.command.name === "Modal") {
            obj.command.params = [document.getElementById("param1").value, document.getElementById("param2").value,
                document.getElementById("param3").value];
            document.getElementById("param1").value = "";
            document.getElementById("param2").value = "";
            document.getElementById("param3").value = "";
        }
        else {
            obj.command.params = [document.getElementById("servCommand").value];
        }
        socket.emit("message operator", obj);
    }

    // subscribe();
    //
    // function subscribe() {
    //     let str = "http://localhost:1800/subscribe?username=" + user+"&bot=false";
    //     console.log(str);
    //     var xhr = new XMLHttpRequest();
    //     xhr.open("GET", str, true);
    //     xhr.onload = function () {
    //         if (xhr.status === 200) {
    //             console.log(xhr.statusText);
    //             document.querySelector(".messages").value = JSON.parse(xhr.responseText);
    //             subscribe();
    //         }
    //         else {
    //             setTimeout(subscribe, 500);
    //         }
    //     };
    //
    //     xhr.send(null);
    // }

    /**Function send message from operator on server*/
    function submitForm() {
        let date = new Date();
        let textarea = document.getElementById("inputMessage");
        let str = date.getHours() + ":" + date.getMinutes() + " Operator: " + textarea.value + "\n";
        document.getElementById("messages").value += str;
        const obj = {
            username: user,
            str: str,
        };
        socket.emit("message operator", obj);
        textarea.value = "";
    }

    // function submitForm() {
    //     let date = new Date();
    //     let textarea = document.getElementById("inputMessage");
    //     let str = date.getHours() + ":" + date.getMinutes() + " Operator: " + textarea.value + "\n";
    //     document.getElementById("messages").value += str;
    //     const obj = {
    //         username: user,
    //         str: str,
    //         operator:true,
    //         bot:false,
    //     };
    //     const xmlhttp = new XMLHttpRequest();
    //     xmlhttp.open("POST", ("http://localhost:1800/value?username" + user), true);
    //     xmlhttp.setRequestHeader("Content-Type", "application/json");
    //     xmlhttp.onload = function () {
    //         console.log(xmlhttp.responseText);
    //     };
    //     xmlhttp.send(JSON.stringify(obj));
    //     textarea.value = "";
    //
    // }
})()
