# angular-inline-text-editor
A very basic WYSIWYG inline editor for AngularJS. (Demo)[http://blitzen.github.io/]

## Dependencies
- AngularJS
- [Rangy](https://github.com/timdown/rangy) v1.3 (specifically, rangy-core.js, rangy-selectionsaverestor.js, rangyclassapplier.js)
- Bootstap (CSS only)

## Installation
- via bower: ```bower install angular-inline-text-editor --save-dev```
- In order, include Angular, the three Rangy libraries mentioned above, and ite.js
- Add angular-inline-text-editor as a dependency to your app module

``` javascript
angular.module( 'myApp', [
  'InlineTextEditor'
]);
```

## Usage
- The text editor is an attribute directive, so usage looks something like this: 
``` html
<div inline-text-editor ng-model="myModel" class="inline-text-editor" contentEditable></div>
```
- The contentEditable property is optional, but typically recommended assuming you want users to be able make edits.
- Currently there is no explict save handler on the directive in order to keep things as simple as possible, but you can easily add an ```ng-change``` and bind a save function to the model.
- If you need to see bound updates to the model immediately, you can set up a separate div that uses the included toTrusted filter: 
``` html
<div ng-bind-html="myModel | toTrusted"></div>
```

## Contributing
- The default toolbar should be configurable to allow additional button types.
- Currently there are no unit tests (preference is karma w/ jasmine)
