NgReact.js
==========

Intro
-----
Facebook's React library is designed to be used as a view component atop other JavaScript frameworks. NgReact is a pair of proof of concept directives that show how React can cooperate with Angular, resulting in performance gains nearly up to 78% (or, well, losses up to 23%).

Installation
------------
```bower install ngReact```

Set Up
------
```
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/underscore/underscore-min.js"></script>
<script src="bower_components/react/react.js"></script>
<script src="bower_components/react/JSXTransformer.js"></script>
<script src="bower_components/ngReact/ngReact.min.js"></script>
```

Declare ngReact as a dependency of your Angular module:

```angular.module('ngReactDemo', ['ngReact']);```

See more at [http://davidchang.github.io/ngReact](http://davidchang.github.io/ngReact).
