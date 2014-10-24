var app = angular.module( 'app', ['react'] );

app.controller( 'mainCtrl', function( $scope ) {
  $scope.person = { fname: 'Clark', lname: 'Kent' };
} );

app.filter( 'hero', function() {
  return function( person ) {
    if ( person.fname === 'Clark' && person.lname === 'Kent' ) {
      return 'Superman';
    }
    return person.fname + ' ' + person.lname;
  };
} );

app.factory( "Hello", function( $filter ) {
  return React.createClass( {
    propTypes: {
      fname: React.PropTypes.string.isRequired,
      lname: React.PropTypes.string.isRequired
    },

    render: function() {
      return React.DOM.span( null,
        'Hello ' + $filter( 'hero' )( this.props )
      );
    }
  } );
} );

app.directive( 'hello', function( reactDirective, Hello ) {
  return reactDirective( Hello );
} );