// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var anotherDataSchema = new Schema({
    ownedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    anotherNumberData: {
        type: Number,
        required: true
    },
    anotherStringData: {
        type: String,
        required: true
    },
    anotherBooleanData: {
        type: Boolean,
        default: false
    }
    
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var AnotherData = mongoose.model('AnotherData', anotherDataSchema);

// make this available to our Node applications
module.exports = AnotherData;