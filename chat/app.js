const express = require("express");
const app = express();
const bodyParser = require("body-parser");

let io = require("socket.io").listen(app.listen(1800));
const User = require("./models/user_m.js");
let config = {
    botName: "Bot",
    showDataTime: true,
};
const chat = require("./public/scripts/clients.js");
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));

app.post("/config", (req, res) => {
    config.botName = req.body.botName === undefined ? "Bot" : req.body.botName;
    config.showDataTime = req.body.showDataTime === undefined ? true : req.body.showDataTime;
    res.status(200).end();
});

app.get("/state", (req, res) => {
    const makeRequest = async () => {
        if (req.query.state != undefined) {
            User.updateState(req.query.username, req.query.state);
            res.send(JSON.stringify(req.query.state));
            res.status(200).end();
        }
        else {
            let obj = await User.findState(req.query.username);
            if (obj.state !== undefined) {
                res.send(JSON.stringify(obj.state));
                res.status(200).end();
            } else res.status(404).end();
        }
    };
    makeRequest();
});
app.get("/value", (req, res) => {
    //chat.subscribe(req, res);
    const makeRequest = async () => {
        let obj = await User.findState(req.query.username);
        if (req.query.bot)
            res.send(JSON.stringify(obj.dialog));
        else
            res.send(JSON.stringify(obj.operator));
        res.status(200).end();

    };
    makeRequest();
});
app.get("/subscribe", (req, res) => {
    chat.subscribe(req, res);
});
app.get("/operator", (req, res) => {
    const makeRequest = async () => {
        let obj = await User.findState(req.query.username);
        if (obj.operator !== undefined) {
            let obj2 = {
                operator: obj.operator,
                command: obj.command,
            };
            res.send(JSON.stringify(obj2));
            res.status(200).end();
        } else res.status(404).end();
    };
    makeRequest();
});
app.get("/command", (req, res) => {
    const makeRequest = async () => {
        let obj = await User.findState(req.query.username);
        let resp = [];
        for (let j = 0; j < obj.command.length; j++) {
            if (!obj.command[j].done)
                resp.push(obj.command[j]);
        }
        if (resp) {
            res.send(JSON.stringify(resp));
        }
        else {
            res.send(null);
        }
        res.status(200).end();
    };
    makeRequest();
});
app.get("/users", (req, res) => {
    const makeRequest = async () => {
        let obj = await User.findUsers();
        if (obj) {
            res.send(JSON.stringify(obj));
            res.status(200).end();
        } else res.status(404).end();
    };
    makeRequest();
});
app.get("/html/spa1.html/operator", (req, res) => {
    res.redirect("../spa1.html");
});
app.get("/html/spa1.html/about", (req, res) => {
    res.redirect("../spa1.html");
});
app.get("/html/spa1.html/configuration", (req, res) => {
    res.redirect("../spa1.html");
});

app.get("/authorize", (req, res) => {
    const user = {username: req.query.username, state: req.query.state};
    const userA = {username: req.query.username, password: req.query.password};
    console.log(user, userA);
    const makeRequest = async () => {
        const users = await User.validateUser(userA);
        if (users.length === 0) {
            User.addUser(userA);
            user.dialog = "";
            user.operator="";
            res.send(JSON.stringify(user));
            res.status(200).end();
        } else {
            const user3 = await User.comparePass(userA, users[0]);
            if (user3 && users[0].username) {
                user.dialog = users[0].dialog;
                user.operator=users[0].operator;
                user.state = users[0].state;
                res.send(JSON.stringify(user));
                res.status(200).end();
            } else {
                const uuser = await User.findState("Anonym");
                res.send(JSON.stringify(uuser));
                res.status(200).end();
            }
        }
    };
    makeRequest();
});

app.post("/value", (req, res) => {
    const makeRequest = async () => {
        let obj = await User.findState(req.body.username);
        if (obj.dialog !== undefined) {
            if (req.body.bot) {
                let date = new Date();
                let str;
                if (config.showDataTime) {
                    str = date.getHours() + ":" + date.getMinutes() + config.botName + ": Ответ на " + req.body.value.toUpperCase() + "\n";
                }
                else {
                    str = config.botName + ": Ответ на " + req.body.value.toUpperCase() + "\n";
                }
                obj.dialog += req.body.str;
                obj.dialog += str;
                User.updateDialog(req.body.username, obj.dialog);
                chat.publish(JSON.stringify(obj.dialog));
                res.end("ok");
            } else {
                obj.operator += req.body.str;
                User.updateOperatorDialog(req.body.username, obj.operator);
                chat.publish(JSON.stringify(obj.operator));
                res.end("ok");
            }
        } else res.status(404).end();
    };
    makeRequest();
});

io.on("connection", function (socket) {
    console.log("connected");
    socket.on("message", function (data2) {
        if (data2.bot) {
            let date = new Date();
            let str;
            if (config.showDataTime) {
                str = date.getHours() + ":" + date.getMinutes() + " " + config.botName + ": Ответ на " + data2.value.toUpperCase() + "\n";
            }
            else {
                str = " " + config.botName + ": Ответ на " + data2.value.toUpperCase() + "\n";
            }
            let objS = {
                username: data2.username,
                str: data2.str,
            };
            const makeRequest = async () => {
                let obj = await User.findState(data2.username);
                obj.dialog += data2.str;
                obj.dialog += str;
                User.updateDialog(data2.username, obj.dialog);
                objS.str = str;
                io.emit("new message", objS);
            };
            makeRequest();
        } else {
            const makeRequest = async () => {
                let obj = await User.findState(data2.username);
                if (data2.command) {
                    let i = 0;
                    for (let j = 0; j < obj.command.length; j++) {
                        if (obj.command[j].id2 === data2.id2) {
                            i = j;
                            break;
                        }
                    }
                    obj.command[i].done = true;
                    obj.command[i].result = data2.str;
                    let str = obj.command[i].date + " " + obj.command[i].name + "(";
                    for (let j = 0; j < obj.command[i].params.length; j++) {
                        str += (obj.command[i].params[j] + ",");
                    }
                    str += (") - " + obj.command[i].result + "\n");
                    User.updateCommand(data2.username, obj.command);
                    io.emit("new command user", {str: str, username: data2.username});
                } else {
                    obj.operator += data2.str;
                    User.updateOperatorDialog(data2.username, obj.operator);
                    let obj2 = {str: data2.str, username: data2.username};
                    io.emit("new message user", obj2);
                }
            };
            makeRequest();
        }
    });
    socket.on("message operator", function (data2) {
        const makeRequest = async () => {
            let obj = await User.findState(data2.username);
            if (data2.command) {
                let date = new Date();
                let com = {
                    id2: +date.getTime(),
                    date: date.getHours() + ":" + date.getMinutes(),
                    name: data2.command.name,
                    done: false,
                    params: data2.command.params,
                };
                User.addCommand(data2.username, com);
                data2.command.id2 = com.id2;
                io.emit("new command operator", data2);
            } else {
                obj.operator += data2.str;
                User.updateOperatorDialog(data2.username, obj.operator);
                io.emit("new message operator", {str: data2.str, username: data2.username});
            }
        }

        makeRequest();
    });

    socket.on("authorize", function (objUser) {
        const user = {username: objUser.username, state: objUser.state};
        const userA = {username: objUser.username, password: objUser.password};
        const makeRequest = async () => {
            const users = await User.validateUser(userA);
            if (users.length === 0) {
                User.addUser(userA);
                user.dialog = "";
                user.operator="";
                user.windowId = objUser.windowId;
                io.emit("new user", user);
            } else {
                const user3 = await User.comparePass(userA, users[0]);
                if (user3 && users[0].username) {
                    user.dialog = users[0].dialog;
                    user.state = users[0].state;
                    user.operator=users[0].operator;
                    user.windowId = objUser.windowId;
                    io.emit("new user", user);
                } else {
                    const uuser = await User.findState("Anonym");
                    uuser.windowId = objUser.windowId;
                    io.emit("new user", uuser);
                }
            }
        };
        makeRequest();
    });
})
;