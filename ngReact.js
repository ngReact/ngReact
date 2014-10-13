( function( React, angular ) {
  'use strict';

  // Directive that allows react.js components to be used in angular templates.
  //
  // Usage:
  //   <react-component name="Hello" props="name"/>
  //
  // This requires that there exists an injectable "Hello" react component.
  // The 'props' is optional and is passed to the component.
  //
  // The following would would create and register the component
  //
  //    /** @jsx React.DOM */
  //    var module = angular.module( 'ace.react.components' );
  //    module.value( "Hello", React.createClass( {
  //      render: function() {
  //        return <div>Hello {this.props.name}</div>;
  //      }
  //    } ) );
  //
  // modified version of http://davidchang.github.io/ngReact/
  var reactComponent = function( $timeout, $injector ) {
    return {
      restrict: 'E',
      replace: true,
      link: function( scope, elem, attrs ) {
        var reactComponentName = attrs.name;
        if ( !reactComponentName ) {
          throw new Error( 'csReactComponent name attribute must be specified' );
        }
        var reactComponent = $injector.get( reactComponentName ) || window[reactComponentName];
        if ( !reactComponent ) {
          throw Error( 'Cannot find react component ' + reactComponentName );
        }
        // returns function that wraps fn inside a scope.$apply call;
        function applied( fn ) {
          return function() {
            var args = arguments;
            scope.$apply( function() { fn.apply( null, args ); } );
          };
        }
        // render react componet passing attrs.props as props
        function renderComponent( ) {
          var scopeProps = scope[attrs.props] || {};
          var props = {};
          Object.keys( scopeProps ).forEach( function( key ) {
            var obj = scopeProps[key];
            // wrap functions in a function that ensures they are scope.$applied
            // ensures that when function is called from a React component
            // the angular digest cycle is run
            props[key] = angular.isFunction( obj ) ? applied( obj ) : obj;
          } );

          $timeout( function() {
            React.renderComponent( reactComponent( props ), elem[0] );
          } );
        }

        // When props change run render component
        attrs.props ?
          scope.$watch( attrs.props, renderComponent, true ) :
          renderComponent();

        // cleanup when scope is destroyed
        scope.$on('$destroy', function () {
          React.unmountComponentAtNode( elem[0] );
        } );
      }
    };
  };

  // factory function for creating a directive for a react component.
  // With a component like this:
  //
  //   /** @jsx React.DOM */
  //    var module = angular.module( 'ace.react.components' );
  //    module.value( "Hello", React.createClass( {
  //      render: function() {
  //        return <div>Hello {this.props.name}</div>;
  //      }
  //    } ) );
  //
  // A directive can be created and registered with
  //
  //   directive( 'hello', function( reactDirective ) {
  //     reactDirective( 'Hello', ['name'] )
  //   }
  //
  // This directive can be used like this
  //
  //   <hello name="name"/>
  //
  var reactDirectiveFactory = function( $injector ) {
    return function( reactComponentName, propNames ) {
      return {
        restrict: 'E',
        replace: true,
        link: function( scope, elm, attrs ) {
          var reactComponent = $injector.get( reactComponentName ) || window[reactComponentName];
          if ( !reactComponent ) {
            throw Error( 'Cannot find react component ' + reactComponentName );
          }
          propNames = propNames || Object.keys( reactComponent.propTypes || {} );

          function updateProps() {
            var props = {};
            propNames.forEach( function( k ) {
              props[k] = scope.$eval(attrs[k]);
            } );
            scope.props = props;
          }

          // watch for each property name and update scope.props with new value
          propNames.forEach( function( k ) {
            scope.$watch( attrs[k], function() {
              updateProps();
            }, true );
          } );
          updateProps();
        },
        template: '<react-component name="' + reactComponentName + '" props="props"></react-component>'
      };
    };
  };

  angular.module( 'react', [] )
    .directive( 'reactComponent', ['$timeout', '$injector', reactComponent ] )
    .factory( 'reactDirective', ['$injector', reactDirectiveFactory ] );

} )( window.React, window.angular );