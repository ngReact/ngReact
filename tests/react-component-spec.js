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
        'Hello ' + (this.props.fname || '') + ' ' + (this.props.lname || '')
      );
    }
  });

  describe('react-component', function() {

    var compileElement, provide;

    beforeEach(module('react'));

    beforeEach(module(function($provide) {
      provide = $provide;
    }));

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

      beforeEach(function() {
        window.GlobalHello = Hello;
        provide.value('InjectedHello', Hello);
      });

      afterEach(function(){
        window.GlobalHello = undefined;
      });

      it('should create global component with name', function() {
        var elm = compileElement( '<react-component name="GlobalHello"/>');
        expect(elm.text().trim()).toEqual('Hello');
      });

      it('should create injectable component with name', function() {
        var elm = compileElement( '<react-component name="InjectedHello"/>' );
        expect(elm.text().trim()).toEqual('Hello');
      });
    });

    describe('properties',function(){

      beforeEach(function() {
        provide.value('Hello', Hello);
      });

      it('should bind to properties on scope', inject(function($rootScope) {
        var scope = $rootScope.$new();
        scope.person = { fname: 'Clark', lname: 'Kent' };

        var elm = compileElement(
          '<react-component name="Hello" props="person"/>',
          scope
        );
        expect(elm.text().trim()).toEqual('Hello Clark Kent');
      }));

      it('should rerender when scope is updated',
         inject(function($rootScope, $timeout) {

        var scope = $rootScope.$new();
        scope.person = { fname: 'Clark', lname: 'Kent' };

        var elm = compileElement(
          '<react-component name="Hello" props="person"/>',
          scope
        );

        expect(elm.text().trim()).toEqual('Hello Clark Kent');

        scope.person.fname = 'Bruce';
        scope.person.lname = 'Banner';
        scope.$apply();
        $timeout.flush();

        expect(elm.text().trim()).toEqual('Hello Bruce Banner');
      }));

      it('should accept callbacks on scope',
         inject(function($rootScope, $timeout) {

        var scope = $rootScope.$new();
        scope.person = {
          fname: 'Clark', lname: 'Kent',
          changeName: function(){
            scope.person.fname = 'Bruce';
            scope.person.lname = 'Banner';
          }
        };

        var elm = compileElement(
          '<react-component name="Hello" props="person"/>',
          scope
        );
        expect(elm.text().trim()).toEqual('Hello Clark Kent');

        React.addons.TestUtils.Simulate.click( elm[0].firstChild );
        $timeout.flush();

        expect(elm.text().trim()).toEqual('Hello Bruce Banner');
      }));
    });

    describe('destruction', function() {

      beforeEach(function() {
        provide.value('Hello', Hello);
      });

      it('should unmount component when scope is destroyed',
         inject(function($rootScope) {

        var scope = $rootScope.$new();
        var elm = compileElement(
          '<react-component name="Hello" props="person"/>',
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