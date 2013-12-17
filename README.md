NgReact.js
==========

Intro
-----
Facebook's React library is designed to be used as a view component atop other JavaScript frameworks. NgReact is a pair of proof of concept directives that show how React can cooperate with Angular, resulting in performance gains nearly up to 70% (or, well, losses up to 450%).

Installation
------------
```bower install ngReact```

Set Up
------
```
&lt;script src="bower_components/angular/angular.js"&gt;&lt;/script&gt;
&lt;script src="bower_components/underscore/underscore-min.js">&lt;/script&gt;
&lt;script src="bower_components/react/react.js"&gt;&lt;/script&gt;
&lt;script src="bower_components/react/JSXTransformer.js"&gt;&lt;/script&gt;
```

Declare ngReact as a dependency of your Angular module:

```angular.module('ngReactDemo', ['ngReact']);```

See more at [http://davidchang.github.io/ngReact](http://davidchang.github.io/ngReact).
