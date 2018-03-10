// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dataSchema = new Schema({
    ownedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    numberData: {
        type: Number,
        required: true
    },
    stringData: {
        type: String,
        required: true
    },
    booleanData: {
        type: Boolean,
        default: false
    }
    
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Data = mongoose.model('Data', dataSchema);

// make this available to our Node applications
module.exports = Data;