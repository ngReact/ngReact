var app = angular.module('app', ['react']);

app.controller('mainCtrl', function ($scope) {
	$scope.eventPrevented = ['click'];
});

var Hello = React.createClass({
  propTypes: {},

  render: function () {
    return React.createElement('a', { href: '#' }, 'anchor');
  }
});

app.value("Hello1", Hello);
app.value("Hello2", Hello);

app.directive('hello', function (reactDirective) {
  return reactDirective(Hello);
});
