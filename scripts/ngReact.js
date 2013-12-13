_.mixin({
  ngReactFormat: function(template, data) {
    return template.replace(/{(\d+)}/g, function(match, number) {
      return typeof data[number] != 'undefined'
        ? data[number]
        : match
      ;
    });
  },
  ngReactBracketNotation: function(string) {
    return string.replace(/\.(\w+)/g, function(match) {
      return _.ngReactFormat('[\'{0}\']', [match.substring(1)]);
    });
  }
});

var NgReact = (function() {

  var onClickNameRegex = /\w+/g,
    onClickVarsRegex = /\(.*\)/g;

  var propertiesToKeep = [
    {
      attrName : 'class',
      propName : 'className',
      name     : 'className'
    }, {
      attrName         : 'ng-click',
      propName         : 'onClick',
      name             : 'onClick',
      convertAttribute : function(attrs, scope, data) {

        if (!attrs.onClick) {
          return;
        }

        var onclickFunctionName = _.first(attrs.onClick.match(onClickNameRegex)),
          onClickFunctionVars = _.first(attrs.onClick.match(onClickVarsRegex));
        onClickFunctionVars = onClickFunctionVars.substring(1, onClickFunctionVars.length - 1);

        var defineHandler = _.ngReactFormat('var {0} = {1}; var handler = scope.$apply.bind(scope, scope.{2}.bind(null, {3}));', [
          scope.alias,
          JSON.stringify(data),
          onclickFunctionName,
          onClickFunctionVars
        ]);

        eval(defineHandler);
        attrs.onClick = handler;
      }
    }, {
      name : 'id'
    }, {
      name         : 'ng-bind',
      convertValue : function(attrs, scope, data) {

        if (!attrs['ng-bind']) {
          return;
        }

        var defineValue = _.ngReactFormat('var {0} = {1}; var value = {2};', [
          scope.alias,
          JSON.stringify(data),
          _.ngReactBracketNotation(attrs['ng-bind'])
        ]);

        eval(defineValue);
        return value;
      }
    }
  ];

  var getAttributes = function(el) {
    var toReturn = {};

    _.each(propertiesToKeep, function(property) {
      var attr = _.findWhere(_.values(el.attributes), {localName : property.attrName || property.name});
      if (attr) {
        toReturn[property.propName || property.name] = attr.value;
      }
    });

    return toReturn;
  };

  var convertAttributes = function(attrs, scope, data) {
    _.each(attrs, function(value, key) {
      var property = _.findWhere(propertiesToKeep, {propName: key});
      if (property && property.convertAttribute) {
        property.convertAttribute(attrs, scope, data);
      }
    });

    console.log('convertAttributes returning', attrs);
  };

  var convertValues = function(attrs, scope, data) {
    return _.compact(_.map(attrs, function(value, key) {
      var property = _.findWhere(propertiesToKeep, {name: key});
      if (property && property.convertValue) {
        return property.convertValue(attrs, scope, data);
      }
    }));
  };

  var NgReactClasses = {
    reactUnit : React.createClass({
      render: function() {
        console.warn('running reactUnit render');

        var data = this.props.data,
          scope = this.props.scope,
          domEl = this.props.domEl;

        var childrenNodes = _.compact(_.map(domEl.children, function(child) {
          //everything needs to be in an element or it will be ignored!
          if (!child.localName) return;

          return NgReactClasses.reactUnit({
            scope : scope,
            data  : data,
            domEl : child
          });
        }));

        var attrs = getAttributes(domEl);
        convertAttributes(attrs, scope, data);

        var vals = convertValues(attrs, scope, data);
        if (!(vals.length && domEl.localName)) {
          //basically look only for text that is a direct descendant of domEl
          //but doesn't exist in a tag (which will be caught recursively later)
          _.each(domEl.innerHTML.split(/(<[^>]*>.*<\/[^>]*>)/g), function(text) {
            if (text.match(/^[\w\s]+$/)) {
              vals.push(text);
            }
          });
        }

        return React.DOM[domEl.localName].apply(
          null,
          [attrs].concat(
            vals,
            childrenNodes
          )
        );
      }
    }),
    /**
    * ReactRepeatUnit is a React component that represents a single repeated unit, a single run of the for loop
    * iterating over a collection.
    */
    reactRepeatUnit : React.createClass({
      render: function() {
        console.error('running reactRepeatUnit render');

        var data = this.props.data,
          scope = this.props.scope;

        var rowTranscluded = _.compact(_.map(this.props.transcludedDom, function(domEl) {
          //everything needs to be in an element or it will be ignored!
          if (!domEl.localName) return;

          var unitFn = NgReactClasses.reactUnit({
            scope : scope,
            data  : data,
            domEl : domEl
          });
          return unitFn;
        }));

        var attrs = getAttributes(this.props.rootUnit);
        convertAttributes(attrs, scope, data);

        return React.DOM[this.props.rootUnit.localName].apply(
          null,
          [attrs].concat(
            convertValues(attrs, scope, data),
            rowTranscluded
          )
        );
      }
    }),
    /**
    * ReactRepeat is a React component that will create and append to itself multiple rows of ReactRepeatUnit per data.
    * It is basically the container for everything that will be repeated.
    */
    reactRepeat : React.createClass({
      render: function() {
        console.log('running reactRepeat render');

        var scope = this.props.scope,
          rootUnit = this.props.rootUnit,
          transcludedDom = this.props.transcluded,
          rows = _.map(scope.data, function(datum) {
            return NgReactClasses.reactRepeatUnit({
              scope          : scope,
              data           : datum,          //datum to render on the HTML unit
              transcludedDom : transcludedDom, //HTML unit (all children) that needs to be repeated
              rootUnit       : rootUnit        //HTML unit (parent, that had the ng-react-repeat directive)
            });
          });

        //here, rootUnit.parentElement.localName is the tbody, rootUnit.localName is the tr
        return React.DOM[rootUnit.parentElement.localName].apply(null, [getAttributes(rootUnit.parentElement)].concat(rows));
      }
    })
  };

  return NgReactClasses;

})();



angular.module('ngReact', [])
  .directive('ngReactRepeat', function ($timeout) {
    return {
      restrict: 'A',
      transclude: true,
      replace: true,
      controller: [
        '$scope', '$element', '$attrs', '$transclude',
        function ($scope, $element, $attrs, $transclude) {

          var pieces = $attrs['ngReactRepeat'].split(' in ');
          if (pieces.length !== 2) {
            console.error('ngReactRepeat expected "alias in collection" format');
          }

          $scope.alias = pieces[0];

          var parentReference = $element[0].offsetParent;

          $transclude(function(clone) {
            $scope.$watch(pieces[1], function(val) {

              console.error('watcher firing, about to kick off React.renderComponent', $scope);

              $timeout(function() {

                React.renderComponent(
                  NgReact.reactRepeat({
                    scope       : $scope,
                    transcluded : clone,
                    rootUnit    : $element[0]
                  }),
                  parentReference
                );

              });
            }, true);
          });
        }
      ]
    };
  });