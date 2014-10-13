#angular-react

The [React.js](http://facebook.github.io/react/) library can be used as a view component in web applications. Based on [NgReact](https://github.com/davidchang/ngReact) angular-react is a angular directive (called `react-component`) and an service (called `reactDirective`) that allows React Components to be used in [AngularJS](https://angularjs.org/) applications.

**angular-react** can be used in existing angular applications, to replace areas of views with react components.

## reactComponent directive
The reactComponent directive allows you to add React Components to your angular views.

With an angular app and controller declaration like this:

```javascript
var app = angular.module( 'app', ['angular-react'] );

app.controller( 'helloController', function( $scope ) {
  $scope.person = { fname: 'Clark', lname: 'Kent' };
} );
```

And a React Component like this

```javascript
/** @jsx React.DOM */
app.value( "Hello", React.createClass( {
  propTypes: {
    fname: React.PropTypes.string.isRequired,
    lname: React.PropTypes.string.isRequired
  },
  render: function() {
    return <span>Hello {this.props.fname} {this.props.lname}</span>;
  }
} ) );
```
The component can be used in an angular view using react-component like this.

```html
<body ng-app="app">
  <h1 ng-controller="helloController">
    <react-component name="Hello" props="person"/>
  </h1>
</body>
```

## reactDirective service
With the `reactDirective` service you can create named directives backed by React components. The service takes the name of the React component as argument.

```javascript
app.directive( 'hello', function( reactDirective ) {
  return reactDirective( 'Hello' );
} );
```

This creates a directive that can be used like this.

```html
<body ng-app="app">
  <h1 ng-controller="helloController">
    <hello fname="person.fname" lname="person.lname"/>
  </h1>
</body>
```

## Reusing angular services
In an existing angular application you'll often have existing services or filters that you wish to use from your React component. You can use angular's dependency injector to get hold of those.

```javascript
app.filter( 'hero', function() {
  return function( person ) {
    if ( person.fname === 'Clark' && person.lname === 'Kent' ) {
      return 'Superman';
    }
    return person.fname + ' ' + person.lname;
  };
} );

/** @jsx React.DOM */
app.factory( "Hello", function( $filter ) {
  return React.createClass( {
    propTypes: {
      person: React.PropTypes.object.isRequired,
    },
    render: function() {
      return <span>Hello $filter( 'hero' )( this.props.person )</span>;
    }
  } );
} );
```






