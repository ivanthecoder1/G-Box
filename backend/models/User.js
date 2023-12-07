const mongoose = require('mongoose');


// User Schema
const userSchema = new mongoose.Schema({
    SteamID: {
        type: Number,
        index: {unique: true},
    },
    UserName: {
        type: String,
        required: true,
    },
});


const User = mongoose.model('User', userSchema);


module.exports = User;