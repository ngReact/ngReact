# CHANGES

## 0.1.4

- Fix: Make it work with Browserify (#37)
- Enhancement: Allow ability to override default configuration for components created via the reactDirective factory (#34)
- Fix/Enhancement: Allow React components on the window to be namespaced (ex: "Views.Components.ThisReactComponentIsNamespaced")
- Fix/Enhancement: Allow for "controller as" syntax (had been broken) (#40)
- Enhancement: Set up Travis CI

## 0.1.2

- Fix: bug where fallback to use globally exposed React was incorrectly using window.react instead of window.React
- Fix: bug where minified code would always expect CommonJS environment due to "exports" always being an object (since we were using wrap=true in Uglify config)

## 0.1.1

- **Breaking**: Enhancement: Upgrading to React v0.12 (breaking as React begins to deprecate their API)
- Fix: Support usage in CommonJS and AMD environments (thanks to @alexanderbeletsky)
- Fix: bug where fallback to look for React component on the window was not reached because the $injector would throw an error
- Enhancement: Modify reactDirective to be able to take the React component itself as the argument (rather than a String for the React component's name, which is also still supported)
- Enhancement: Unit test support