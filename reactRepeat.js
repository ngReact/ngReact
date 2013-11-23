/** @jsx React.DOM */

window.FundooRating = React.createClass({
  render: function() {
    var items = [];
    for (var i = 0; i < this.props.scope.max; i++) {
      var clickHandler = this.props.scope.$apply.bind(this.props.scope, this.props.scope.toggle.bind(null, i));
      items.push(<li class={i < this.props.scope.ratingValue && 'filled'} onClick={clickHandler}>{'\u2605'}</li>);
    }
    return <ul class="rating">{items}</ul>;
  }
});