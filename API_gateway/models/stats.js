var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var statSchema = new Schema({
    ownedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    application: String,
    feature: String,
    operation: String,
    permitted: Boolean
},{
    timestamps: true
});

module.exports = mongoose.model('Stat', statSchema);