/**This file exports functions for work with longpolling(sometimes it works wrong)*/
var clients = [];
/**This function add subsribers*/
exports.subscribe = function (req, res) {
    console.log("subscribe", clients.length);
    clients.push(res);
};

/**This function responds to the existing requests
 * @param {String} message which should be sent*/
exports.publish = function (message) {
    clients.forEach(function (res) {
        res.end(message);
        res.status(200).end();
    });
    console.log(clients.length);
    clients = [];
};