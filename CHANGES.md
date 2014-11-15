# CHANGES

## 0.1.1

- **Breaking**: Enhancement: Upgrading to React v0.12 (breaking as React begins to deprecate their API)
- Fix: Support usage in CommonJS and AMD environments (thanks to @alexanderbeletsky)
- Fix: bug where fallback to look for React component on the window was not reached because the $injector would throw an error
- Enhancement: Modify reactDirective to be able to take the React component itself as the argument (rather than a String for the React component's name, which is also still supported)
- Enhancement: Unit test support