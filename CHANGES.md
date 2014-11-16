# CHANGES

## 0.1.2

- Fix: bug where fallback to use globally exposed React was incorrectly using window.react instead of window.React
- Fix: bug where minified code would always expect CommonJS environment due to "exports" always being an object (since we were using wrap=true in Uglify config)

## 0.1.1

- **Breaking**: Enhancement: Upgrading to React v0.12 (breaking as React begins to deprecate their API)
- Fix: Support usage in CommonJS and AMD environments (thanks to @alexanderbeletsky)
- Fix: bug where fallback to look for React component on the window was not reached because the $injector would throw an error
- Enhancement: Modify reactDirective to be able to take the React component itself as the argument (rather than a String for the React component's name, which is also still supported)
- Enhancement: Unit test support