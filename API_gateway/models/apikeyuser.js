// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var apikeyuserSchema = new Schema({
    ownedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    application:{
        type: String,
        required: true,
        unique: true
    },
    jwtToken:{
        type: String,
        required: true
    },
    feat1: {
        type: Boolean,
        dafault: false
    },
    feat2: {
        type: Boolean,
        default: false
    },
    feat3: {
        type: Boolean,
        default: false
    },
    quota: {
        type: Number,
        required: true
    }
    
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Apikeyuser = mongoose.model('Apikeyuser', apikeyuserSchema);

// make this available to our Node applications
module.exports = Apikeyuser;