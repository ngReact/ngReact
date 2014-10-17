# ngReact

The [React.js](http://facebook.github.io/react/) library can be used as a view component in web applications. ngReact is an Angular module that allows React Components to be used in [AngularJS](https://angularjs.org/) applications.

Specifically, ngReact is composed of:

- `react-component`, an Angular directive that delegates off to a React Component
- `reactDirective`, a service for converting React components into the `react-component` Angular directive

**ngReact** can be used in existing angular applications, to replace areas of views with react components.

## The react-component directive

The reactComponent directive allows you to add React Components to your angular views.

With an Angular app and controller declaration like this:

```javascript
angular.module('app', ['react'])
  .controller('helloController', function($scope) {
    $scope.person = { fname: 'Clark', lname: 'Kent' };
  });
```

And a React Component like this

```javascript
/** @jsx React.DOM */
app.value('HelloComponent', React.createClass({
  propTypes: {
    fname : React.PropTypes.string.isRequired,
    lname : React.PropTypes.string.isRequired
  },
  render: function() {
    return <span>Hello {this.props.fname} {this.props.lname}</span>;
  }
}));
```

The component can be used in an Angular view using the react-component directive like so, where:

- the name attribute checks for an Angular injectable of that name and falls back to a globally exposed variable of the same name, and
- the props attribute indicates what scope properties should be exposed to the React component

```html
<body ng-app="app">
  <div ng-controller="helloController">
    <react-component name="HelloComponent" props="person" />
  </div>
</body>
```

## The reactDirective service

With the `reactDirective` service you can create named directives backed by React components. The service takes the name of the React component as the argument.

```javascript
app.directive('hello', function(reactDirective) {
  return reactDirective('Hello');
} );
```

This creates a directive that can be used like this:

```html
<body ng-app="app">
  <div ng-controller="helloController">
    <hello fname="person.fname" lname="person.lname"/>
  </div>
</body>
```

## Reusing Angular injectables

In an existing Angular application, you'll often have existing services or filters that you wish to access from your React component. These can be retrieved using Angular's dependency injection. The React component will still be render-able as aforementioned, using the react-component directive.

```javascript
app.filter('hero', function() {
  return function(person) {
    if (person.fname === 'Clark' && person.lname === 'Kent') {
      return 'Superman';
    }
    return person.fname + ' ' + person.lname;
  };
});

/** @jsx React.DOM */
app.factory('HelloComponent', function($filter) {
  return React.createClass({
    propTypes: {
      person: React.PropTypes.object.isRequired,
    },
    render: function() {
      return <span>Hello $filter('hero')(this.props.person)</span>;
    }
  });
});
```

```html
<body ng-app="app">
  <div ng-controller="helloController">
    <react-component name="HelloComponent" props="person" />
  </div>
</body>
```

# Community

## Maintainers

- Kasper Bøgebjerg Pedersen (@kasperp)
- David Chang (@davidchang)

## Contributors

- Tihomir Kit (@pootzko)