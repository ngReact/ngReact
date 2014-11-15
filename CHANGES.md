# CHANGES

## 0.1.1

- **Breaking**: Upgrading to React v0.12 (as there was breaking API)
- Fix bug where fallback to look for React component on the window was not reached because the $injector would throw an error
- Modify reactDirective to be able to take the React component itself as the argument (rather than a String for the React component's name, which is also still supported)
- Unit test support