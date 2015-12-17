// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ionic.utils'])

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});


app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

      .state('tabs', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      .state('tabs.convert', {
        url: '/convert',
        views: {
          'convert-tab': {
            templateUrl: 'templates/convert.html',
            controller: 'ConvertCtrl'
          }
        }
      })

      .state('tabs.settings', {
        url: '/settings',
        views: {
          'settings-tab': {
            templateUrl: 'templates/settings.html',
            controller: 'ConvertCtrl'
          }
        }
      })

  $urlRouterProvider.otherwise('/tab/convert');
});

app.controller('ConvertCtrl', function($scope, $rootScope, $state, $localstorage, $http, $ionicLoading) {

  $scope.convert = {};
  $rootScope.exchange = $rootScope.exchange || {rate: $localstorage.get('exchangeRate', '')};

  $scope.setRate = function() {
    $localstorage.set('exchangeRate', $rootScope.exchange.rate);
  };

  $scope.calcCur2 = function() {
    if ($rootScope.exchange.rate) {
      $scope.convert.cur2 = ($scope.convert.cur1 / $rootScope.exchange.rate * 100).toFixed(2);
    } else {
      alert('Please set an exchange rate first!');
      $scope.convert.cur1 = "";
      $state.go('tabs.settings');
    }

  };

  $scope.calcCur1 = function() {
    $scope.convert.cur1 = ($scope.convert.cur2 * $rootScope.exchange.rate / 100).toFixed(2);
  };

  $scope.clearFields = function() {
    $scope.convert.cur1 = '';
    $scope.convert.cur2 = '';
  };

  $scope.getTodaysRate = function() {

    $ionicLoading.show();

    $http.get('https://api.fixer.io/latest?symbols=HKD,JPY').success(function(data) {
      var cur1 = Number(data.rates.HKD);
      var cur2 = Number(data.rates.JPY);

      $rootScope.exchange.rate = (cur1/cur2*100).toFixed(3);
      $localstorage.set('exchangeRate', $rootScope.exchange.rate);

      $ionicLoading.hide();
    });
  };

  $scope.showSettings = function() {
    $state.go('tabs.settings');
  }

});














