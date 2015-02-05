'use strict';

/**
 * @ngdoc function
 * @name modelCompanyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the modelCompanyApp
 */
angular.module('modelCompanyApp')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.nationalAverages = {
      'age': 25,
      'height': 68,
      'hair': [{'label': 'black', 'value': .13},
              {'label': 'dark', 'value': .25},
              {'label': 'brown', 'value': .3},
              {'label': 'light', 'value': .24},
              {'label': 'sandy', 'value': .04},
              {'label': 'red', 'value': .03},
              {'label': 'gray', 'value': .01}],
      'eyes': [{'label': 'blue', 'value': .45},
              {'label': 'gray', 'value': .24},
              {'label': 'hazel', 'value': .13},
              {'label': 'brown', 'value': .1},
              {'label': 'black', 'value': .08}],
      'complexion': [{'label': 'light', 'value': .6},
              {'label': 'dark', 'value': .33},
              {'label': 'medium', 'value': .7}],
      'occupation': [{'label': 'farmer', 'value': .48},
              {'label': 'mechanic', 'value': .24},
              {'label': 'laborer', 'value': .16},
              {'label': 'commercial', 'value': .05},
              {'label': 'professional', 'value': .03},
              {'label': 'misc', 'value': .04}]
    }
    $scope.events = [{
        'name': 'Winchester',
        'date': '05/25/1862',
        'type': 'battle'
    }, {
        'name': 'Cedar Mountain',
        'date': '08/09/1862',
        'type': 'battle'
    },
    {
        'name': 'Antietam',
        'date': '09/16/1862',
        'type': 'battle'
    }, {
        'name': 'Chancellorsville',
        'daterange': ['05/01/1863', '05/03/1863'],
        'type': 'battle'
    }, {
        'name': 'Gettysburg',
        'daterange': ['07/01/1863', '07/03/1863'],
        'type': 'battle'
    }, {
        'name': 'Peachtree Creek',
        'date': '07/20/1864',
        'type': 'battle'
    },{
        'name': 'Expiration of 3 years enlistment',
        'date': '09/18/1864',
        'type': 'event'
    },  {
        'name': 'Muster Out',
        'date': '07/16/1865',
        'type': 'event'
    }]

    d3.csv('data/formatted-messes.csv', function(err, data) {
      d3.csv('data/locations.csv', function(err, locations) {
        var dataObj = {};
        _.each(data, function(d) {
          // GeoCode homes
          var geocode = _.find(locations, function(e) { return e.town === d.home;});
          if (geocode) {
            d.latitude = geocode.lat;
            d.longitude = geocode.lon;
          }
          // Dates
          // if (d.dateout !== "NA") {
          //   var date = moment(d.dateout.trim(), "MM/DD/YYYY");
          //   d.dateout = date.valueOf();
          // }
        })
        // Eyes
        dataObj['eyes'] = constructObj(data, 'eyes');
        dataObj['hair'] = constructObj(data, 'hair');
        dataObj['complexion'] = constructObj(data, 'complexion');
        dataObj['age'] = constructObj(data, 'age');
        dataObj['height'] = constructObj(data, 'heightin');
        dataObj['occupation'] = constructObj(data, 'occupation');
        dataObj['date_in'] = constructObj(data, 'datein');
        dataObj['out_reason'] = constructObj(data, 'cause');
        dataObj['out_date'] = constructObj(data, 'dateout');
        dataObj['out_place'] = constructObj(data, 'place');
        dataObj['data'] = data;
        $scope.companyData = dataObj;
        $scope.$apply();
      })
    })

    function constructObj(data, attr, mess) {
        if (mess)
          data = _.reject(data, function(d) { return d.mess !== mess; });
        var attrs = _.pluck(data, attr);
        var obj = {};
        _.each(attrs, function(a) {
            a = a.trim();
            (obj[a] === undefined) ? obj[a] = 1: obj[a] ++;
        });
        var set = [];
        _.each(obj, function(o, key) {
            set.push({
                'label': key,
                'value': parseInt(o)
            })
        })
        return set;
    }

  });
