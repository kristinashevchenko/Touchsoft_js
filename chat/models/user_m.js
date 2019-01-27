const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect("mongodb://kristina_shevchenko:winter2018@ds127604.mlab.com:27604/chat_database", (err) => {
  if (err) throw err;
  console.log("Successfully connected");
});
const User = require("./user.js");


exports.updateDialog=function(username,dialog){
     var query = {username:username};
    return User.findOneAndUpdate(query, {dialog : dialog}, {upsert:true},function(err, person) {
            if (err) {
                console.log('got an error');
            }
        }
    );
};
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
exports.updateCommand=function(username,command){
    var query = {username:username};
    return User.findOneAndUpdate(query, {command: command}, {upsert:true},function(err, person) {
            if (err) {
                console.log('got an error');
            }
        }
    );
};
exports.updateOperatorDialog=function(username,dialog){
    var query = {username:username};
    return User.findOneAndUpdate(query, {operator : dialog}, {upsert:true},function(err, person) {
            if (err) {
                console.log('got an error');
            }
        }
    );
};

exports.updateState=function(username,state){
    var query = {username:username};
    return User.findOneAndUpdate(query, {state : state}, {upsert:true},function(err, person) {
            if (err) {
                console.log('got an error');
            }
        }
    );
};

exports.findState=function(username){
    var query = {username:username};
    return User.findOne(query,function(err,user) {
            return user.state;
        }
    );
};

exports.getUser = function (id) {
  return User.findById(id, (err, obj) => {
    if (err) throw err;
    return obj;
  });
};
exports.comparePass = function (user, users) {
  return bcrypt.compareSync(user.password, users.password);
};
exports.validateUser = function (user) {
  return User.find({ username: user.username }, (err, users) => {
    if (err) { console.log("I'm here"); return err; }
    if (users.length === 0) { return true; }
    return false;
  });
};
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
exports.findUsers=function(){
    return User.find({}, function(err, users) {
        var userMap = {};
        users.forEach(function(user) {
            userMap[user._id] = user.username;
        });
       return userMap;
    });
}

