(function(angular, react) {
  'use strict';

  var module = window.angular.mock.module;

  var Hello = React.createClass({
    propTypes: {
      fname : React.PropTypes.string,
      lname : React.PropTypes.string,
      changeName: React.PropTypes.func
    },

    handleClick: function(){
      this.props.changeName();
    },

    render: function() {
      return React.DOM.div(
        { onClick: this.handleClick },
        'Hello ' + (this.props.fname || '') + ' ' + (this.props.lname || '') +
          (this.props.undeclared || '')
      );
    }
  });

  describe('react-directive', function() {

    var provide, compileProvider;
    var compileElement;

    beforeEach(module('react'));

    beforeEach(module(function($provide, $compileProvider) {
      compileProvider = $compileProvider;
      provide = $provide;
    }));

    afterEach(function(){
      window.GlobalHello = undefined;
    });

    beforeEach(inject(function($rootScope, $compile, $timeout){
      compileElement = function( html, scope ){
        scope = scope || $rootScope;
        var elm = angular.element(html);
        $compile(elm)(scope);
        scope.$digest();
        $timeout.flush();
        return elm;
      };
    }));

    describe('creation', function() {

      beforeEach( function() {
        window.GlobalHello = Hello;
        provide.value('InjectedHello', Hello);
      });

      afterEach(function(){
        window.GlobalHello = undefined;
      });

      it('should create global component with name', function() {
        compileProvider.directive('globalHello', function(reactDirective){
          return reactDirective('GlobalHello');
        });
        var elm = compileElement('<global-hello/>');
        expect(elm.text().trim()).toEqual('Hello');
      });

      it('should create with component', function() {
        compileProvider.directive('helloFromComponent', function(reactDirective){
          return reactDirective(Hello);
        });
        var elm = compileElement('<hello-from-component/>');
        expect(elm.text().trim()).toEqual('Hello');
      });

      it('should create injectable component with name', function() {
        compileProvider.directive('injectedHello', function(reactDirective){
          return reactDirective('InjectedHello');
        });
        var elm = compileElement('<injected-hello/>');
        expect(elm.text().trim()).toEqual('Hello');
      });
    });

    describe('properties',function(){

      beforeEach(function() {
        provide.value('Hello', Hello);
        compileProvider.directive('hello', function(reactDirective){
          return reactDirective('Hello');
        });
      });

      it('should bind to properties on scope', inject(function($rootScope) {
        var scope = $rootScope.$new();
        scope.firstName = 'Clark';
        scope.lastName = 'Kent';

        var elm = compileElement(
          '<hello fname="firstName" lname="lastName"/>',
          scope
        );
        expect(elm.text().trim()).toEqual('Hello Clark Kent');
      }));

      it('should bind to object on scope', inject(function($rootScope) {
        var scope = $rootScope.$new();
        scope.person = { firstName: 'Clark', lastName: 'Kent' };

        var elm = compileElement(
          '<hello fname="person.firstName" lname="person.lastName"/>',
          scope
        );
        expect(elm.text().trim()).toEqual('Hello Clark Kent');
      }));

      it('should rerender when scope is updated',
         inject(function($rootScope, $timeout) {

        var scope = $rootScope.$new();
        scope.person = { firstName: 'Clark', lastName: 'Kent' };

        var elm = compileElement(
          '<hello fname="person.firstName" lname="person.lastName"/>',
          scope
        );

        expect(elm.text().trim()).toEqual('Hello Clark Kent');

        scope.person.firstName = 'Bruce';
        scope.person.lastName = 'Banner';
        scope.$apply();
        $timeout.flush();

        expect(elm.text().trim()).toEqual('Hello Bruce Banner');
      }));

      it('should accept callbacks as properties',
         inject(function($rootScope, $timeout) {

        var scope = $rootScope.$new();
        scope.person = {
          fname: 'Clark', lname: 'Kent'
        };
        scope.change = function(){
          scope.person.fname = 'Bruce';
          scope.person.lname = 'Banner';
        };

        var elm = compileElement(
          '<hello fname="person.fname" lname="person.lname" change-name="change"/>',
          scope
        );
        expect(elm.text().trim()).toEqual('Hello Clark Kent');

        React.addons.TestUtils.Simulate.click( elm[0].firstChild );
        $timeout.flush();

        expect(elm.text().trim()).toEqual('Hello Bruce Banner');
      }));

      it('should accept undeclared properties when specified', inject(function($rootScope) {
        compileProvider.directive('helloWithUndeclared', function(reactDirective){
          return reactDirective('Hello', ['undeclared']);
        });
        var scope = $rootScope.$new();
        scope.name = 'Bruce Wayne';
        var elm = compileElement(
          '<hello-with-undeclared undeclared="name"/>',
          scope
        );
        expect(elm.text().trim()).toEqual('Hello  Bruce Wayne');
      }));

    });

    describe('destruction', function() {

      beforeEach(function() {
        provide.value('Hello', Hello);
        compileProvider.directive('hello', function(reactDirective){
          return reactDirective('Hello');
        });
      });

      it('should unmount component when scope is destroyed',
         inject(function($rootScope) {

        var scope = $rootScope.$new();
        scope.person = { firstName: 'Clark', lastName: 'Kent' };
        var elm = compileElement(
          '<hello fname="person.firstName" lname="person.lastName"/>',
          scope
        );
        scope.$destroy();

        //unmountComponentAtNode returns:
        // * true if a component was unmounted and
        // * false if there was no component to unmount.
        expect( React.unmountComponentAtNode(elm[0])).toEqual(false);
      }));
    });
  });

})(window.angular, window.react);