const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
/**Schema for commands
 * @param {Object} object of command*/
const commandSchema = new mongoose.Schema({
    id2: {type:Number},
    done: {type: Boolean},
    name: {type: String},
    params: [String],
    date:{type:String},
    result:{type:String},
});
/**Schema for user
 * @param {Object} object of user*/
const userSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: [true, "error"]},
    username: {type: String, required: [true, "error"], unique: true},
    password: {type: String, required: [true, "error"]},
    dialog: {type: String,},
    operator: {type: String,},
    state: {type: Boolean},
    command: [commandSchema],
});
userSchema.plugin(uniqueValidator, {message: "already exists"});

const User = mongoose.model("User", userSchema);
module.exports = User;
