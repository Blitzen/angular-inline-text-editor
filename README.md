# Angular-inline-text-editor
A very basic WYSIWYG inline editor for AngularJS. [Demo](http://blitzen.github.io/). NB: this library is still in development and will not be production ready until a v1.0.0 is released. Use at your own risk as functionality will change in the future. 

## Dependencies
- AngularJS
- ngSanitize
- [Rangy](https://github.com/timdown/rangy) v1.3+ (specifically, rangy-core.js, rangy-selectionsaverestor.js, rangyclassapplier.js)
- Bootstap (CSS only)

## Installation
- via bower: ```bower install angular-inline-text-editor --save-dev```
- In order, include Angular, ngSanitize, the three Rangy libraries mentioned above, ite.js and ite.css
- Add angular-inline-text-editor and Angular-Sanitize as a dependency to your app module

``` javascript
angular.module( 'myApp', [
  'ngSanitize',
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
- In order to bind the model to a div: 
``` html
<div ng-bind-html="myModel"></div>
```
- Include ```ite.css``` in the ```head``` of your document/app
- ngSanitize will handle sanitizing any inputted HTML to prevent XSS injection attacks. If you are running into sanitize errors, ensure you are not trying to include unsafe HTML. If you are running this library in a secure environment and are not concerned about sanitization, you can use $sce to trust html.  

## Contributing
- The default toolbar should be configurable to allow additional button types
- Users should be able to specify their own hex codes for colours
- There should be a button (or buttons) to increase/decrease text size. Functionality for a single button option could use the alt key for decreasing text size. This would need to be communicated through a title attribute on the respective button
- Currently there are no unit tests (preference is karma w/ jasmine)
- Bootstrap should be removed as a necessary dependency 
