var Stats = require('../models/stats');

exports.updateStats = function(ownedBy, application, featureName, operation, permitted) {

    var statData = {}; 
    statData.ownedBy = ownedBy;
    statData.application = application;
    statData.feature = featureName;
    statData.operation = operation;
    statData.permitted = permitted;

    Stats.create(statData, function(err, data) {
        if (err) throw err;

        console.log('Stat data stored!');
        }
    )
  }