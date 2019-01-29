const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
/**Connection to database*/
mongoose.connect("mongodb://kristina_shevchenko:winter2018@ds127604.mlab.com:27604/chat_database", (err) => {
  if (err) throw err;
  console.log("Successfully connected");
});
/**Module with schema of user*/
const User = require("./user.js");

/**Updates dialog of user
 * @param {String} username
 * @param {String} dialog
 * @returns {Object} updated user*/
exports.updateDialog=function(username,dialog){
     var query = {username:username};
    return User.findOneAndUpdate(query, {dialog : dialog}, {upsert:true},function(err, person) {
            if (err) {
                console.log('got an error');
            }
        }
    );
};
/**Add new command to user
 * @param {String} username
 * @param {Object} command object
 * @returns {Object} updated user*/
exports.addCommand=function(username,command){
    var query = {username:username};
    command._id2=new mongoose.Types.ObjectId();
    return User.findOneAndUpdate(query, {$push: {command: command}}, {upsert:true},function(err, person) {
            if (err) {
                console.log('got an error');
            }
        }
    );
}
/**Updates command of user
 * @param {String} username
 * @param {Object} command object
 * @returns {Object} updated user*/
exports.updateCommand=function(username,command){
    var query = {username:username};
    return User.findOneAndUpdate(query, {command: command}, {upsert:true},function(err, person) {
            if (err) {
                console.log('got an error');
            }
        }
    );
};
/**Updates user's dialog with operator
 * @param {String} username
 * @param {String} dialog
 * @returns {Object} updated user*/
exports.updateOperatorDialog=function(username,dialog){
    var query = {username:username};
    return User.findOneAndUpdate(query, {operator : dialog}, {upsert:true},function(err, person) {
            if (err) {
                console.log('got an error');
            }
        }
    );
};
/**Updates state of user's dialog
 * @param {String} username
 * @param {Number} state
 * @returns {Object} updated user*/
exports.updateState=function(username,state){
    var query = {username:username};
    return User.findOneAndUpdate(query, {state : state}, {upsert:true},function(err, person) {
            if (err) {
                console.log('got an error');
            }
        }
    );
};
/**Find dialog state of user
 * @param {String} username
 * @returns {Object} finded user*/
exports.findState=function(username){
    var query = {username:username};
    return User.findOne(query,function(err,user) {
            return user.state;
        }
    );
};
/**Compare entered password with user's real password
 * @param {Object} user with entered password
 * @param {Object} users with real password
 * @returns {Boolean} true if equal*/
exports.comparePass = function (user, users) {
  return bcrypt.compareSync(user.password, users.password);
};
/**Find users with such name
 * @param {Object} user
 * @returns {Object} finded user*/
exports.validateUser = function (user) {
  return User.find({ username: user.username }, (err, users) => {
    if (err) { console.log("I'm here"); return err; }
    if (users.length === 0) { return true; }
    return false;
  });
};
/**Add user in database
 * @param {Object} user*/
exports.addUser = function (user) {
  const salt = bcrypt.genSaltSync(10);
  const pas = bcrypt.hashSync(user.password, salt);
  const user2 = new User({
    username: user.username,
    password: pas,
    dialog:"",
    _id: new mongoose.Types.ObjectId(),
      state: true,
      operator:"",
      command:[],
  });
  user2.save((err) => {
    if (err) {
      console.log("Not added",err);
      return err;
    }
    console.log("Added!"); return true;
  });
  return true;
};
/**Find all users
 * @returns {Object|Array} all users*/
exports.findUsers=function(){
    return User.find({}, function(err, users) {
        var userMap = {};
        users.forEach(function(user) {
            userMap[user._id] = user.username;
        });
       return userMap;
    });
}

