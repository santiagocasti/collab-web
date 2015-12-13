//angular.module('F1FeederApp.services', [])
//  .factory('ergastAPIservice', function($http) {
//
//    var ergastAPI = {};
//
//    ergastAPI.getDrivers = function() {
//      return $http({
//        method: 'JSONP',
//        url: 'http://ergast.com/api/f1/2013/driverStandings.json?callback=JSON_CALLBACK'
//      });
//    }
//
//    ergastAPI.getDriverDetails = function(id) {
//      return $http({
//        method: 'JSONP',
//        url: 'http://ergast.com/api/f1/2013/drivers/'+ id +'/driverStandings.json?callback=JSON_CALLBACK'
//      });
//    }
//
//    ergastAPI.getDriverRaces = function(id) {
//      return $http({
//        method: 'JSONP',
//        url: 'http://ergast.com/api/f1/2013/drivers/'+ id +'/results.json?callback=JSON_CALLBACK'
//      });
//    }
//
//    return ergastAPI;
//  });



//app.factory('CRDT', [function(){
//    return $http({
//        method: 'JSONP',
//        url: 'js/crdt/factory.js'
//    });
//}]);


//var VectorClock = require('../crdt/vectorClock.js');
//    var RegisterValue = require('../crdt/registerValue.js');
//    var MVRegister = require('../crdt/multiValueRegister.js');
//    var Counter = require('../crdt/pncounter.js');
//    var CRDT = require('../crdt/factory.js');