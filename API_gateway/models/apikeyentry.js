var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var apiKeyEntrySchema = new Schema({
    ownedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    application:{
        type: String,
        required: true,
        unique: true
    },
    jwtTokenForApiKey: {
        type: String,
        required: true
    },
    apiKeyToProvide: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }        
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var ApiKeyEntry = mongoose.model('Apikey', apiKeyEntrySchema);

// make this available to our Node applications
module.exports = ApiKeyEntry;