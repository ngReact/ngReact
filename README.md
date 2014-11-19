# ngReact

The [React.js](http://facebook.github.io/react/) library can be used as a view component in web applications. ngReact is an Angular module that allows React Components to be used in [AngularJS](https://angularjs.org/) applications.

Motivation for this could be any of the following:

- You need greater performance than Angular can offer (two way data binding, Object.observe, too many scope watchers on the page) and React is typically more performant due to the Virtual DOM and other optimizations it can make

- React offers an easier way to think about the state of your UI; instead of data flowing both ways between controller and view as in two way data binding, React typically eschews this for a more unidirectional/reactive paradigm

- Someone in the React community released a component that you would like to try out

- You're already deep into an Angular application and can't move away, but would like to experiment with React

# Installation

Install via Bower:

```
bower install ngReact
```

or via npm:

```
npm install ngreact
```

# Usage

Then, just make sure Angular, React, and ngReact are on the page,
```
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/react/react.js"></script>
<script src="bower_components/ngReact/ngReact.min.js"></script>
```

and include the 'react' Angular module as a dependency for your new app

```
<script>
    angular.module('app', ['react']);
</script>
```

and you're good to go.

# Features

Specifically, ngReact is composed of:

- `react-component`, an Angular directive that delegates off to a React Component
- `reactDirective`, a service for converting React components into the `react-component` Angular directive

**ngReact** can be used in existing angular applications, to replace entire or partial views with react components.

## The react-component directive

The reactComponent directive is a generic wrapper for embedding your React components.

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
var HelloComponent = React.createClass({
  propTypes: {
    fname : React.PropTypes.string.isRequired,
    lname : React.PropTypes.string.isRequired
  },
  render: function() {
    return <span>Hello {this.props.fname} {this.props.lname}</span>;
  }
})
app.value('HelloComponent', HelloComponent);
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

The reactDirective factory, in contrast to the reactComponent directive, is meant to create specific directives corresponding to React components. In the background, this actually creates and and sets up reactComponent directives specifically bound to the specified React component.

If, for example, you wanted to use the same React component in multiple places, you'd have to specify &lt;react-component name="yourComponent" props="props" /&gt; repeatedly, but if you used reactDirective factory, you could create a yourComponent directive and simply use that everywhere.

The service takes the React component as the argument.

```javascript
app.directive('hello', function(reactDirective) {
  return reactDirective(HelloComponent);
} );
```

Alternatively you can provide the name of the component

```javascript
app.directive('hello', function(reactDirective) {
  return reactDirective('HelloComponent');
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

## Reusing Angular Injectables

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

## Jsx Transformation in the browser
During testing you may want to run the `JSXTransformer` in the browser. For this to work with angular you need to make sure that the jsx code has been transformed before the angular application is bootstrapped. To do so you can [manually bootstrap](https://docs.angularjs.org/guide/bootstrap#manual-initialization) the angular application. For a working example see the [jsx-transformer example](examples/jsx-tranformer).

NOTE: The workaround for this is hacky as the angular bootstap is postponed in with a `setTimeout`, so consider [transforming jsx in a build step](http://facebook.github.io/react/docs/getting-started.html#offline-transform).


## Developing
Before starting development run

```bash
npm install
bower install
```

Build minified version and run tests with

```bash
grunt
```

Continually run test during development with

```bash
grunt karma:background watch
```

# Community

## Maintainers

- Kasper Bøgebjerg Pedersen (@kasperp)
- David Chang (@davidchang)

## Contributors

- Tihomir Kit (@pootzko)
- Alexander Beletsky (@alexanderbeletsky)
