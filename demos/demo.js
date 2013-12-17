angular.module('ngReactDemo', ['ngReact'])
  .controller('DemoCtrl', ['$scope', function($scope) {
    $scope.data = [];
    $scope.started = true;

    $scope.newData = function() {

      $scope.data = [];

      for(var i = 0; i < 500; ++i) {
        $scope.data[i] = {};
        for(var j = 0; j < 5; ++j) {
          $scope.data[i][j] = Math.random();
        }
      }
    };

    $scope.clickHandler = function(obj) {
      console.log(obj);
    };
  }])