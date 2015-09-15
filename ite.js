(function () {

angular.module( 'InlineTextEditor', ['ngSanitize']);

function inlineTextEditor($sce, $compile, $timeout, $window, $sanitize){
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function($scope, element, attrs, ngModel) {

      var html, savedSelection, clickPosition, overToolbar, originalToolbar, toolbar;

      if (!ngModel) { return; }
      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html(ngModel.$viewValue || '');
      };

      // Write data to the model
      function read() {
        var html = element.html();
        if (html == '<br>') {
          angular.element(element).empty();
          html = '';
        }
        ngModel.$setViewValue(html);
      };

      //This is required if the directive holds any angular expressions (i.e. the ng-click expression on images)
      $timeout(function() {
        $compile(element.contents())($scope);
      },0);

      window.onunload = window.onbeforeunload = (function(){
        return function(){
          // do your thing here...
          overlay = document.getElementById('ite-image-resize-overlay');
          if (overlay) {
            return 'you currently have an image selected, please de-select it before leaving the page'
          }
        }
      }());

      $scope.linkUrl = null;
      $scope.expandLinkInput = false;
      $scope.expandEmailInput = false;
      $scope.expandImageInput = false;
      $scope.colorPickerActive = false;
      $scope.colors = [{"gold": "#ffd700"}, {"yellow": "#ffff00"}, {"springgreen": "#00ff7f"}, {"mediumspringgreen": "#00fa9a"}, {"cyan": "#00ffff"}, {"aqua": "#00ffff"}, {"turquoise": "#40e0d0"}, {"mediumturquoise": "#48d1cc"}, {"mediumaquamarine": "#66cdaa"}, {"darkseagreen": "#8fbc8f"}, {"lightgreen": "#90ee90"}, {"palegreen": "#98fb98"}, {"aquamarine": "#7fffd4"}, {"lightskyblue": "#87cefa"}, {"skyblue": "#87ceeb"}, {"paleturquoise": "#afeeee"}, {"powderblue": "#b0e0e6"}, {"lightblue": "#add8e6"}, {"lightsteelblue": "#b0c4de"}, {"silver": "#c0c0c0"}, {"darkgray": "#a9a9a9"}, {"rosybrown": "#bc8f8f"}, {"palevioletred": "#d87093"}, {"hotpink": "#ff69b4"}, {"lightpink": "#ffb6c1"}, {"pink": "#ffc0cb"}, {"lemonchiffon": "#fffacd"}, {"lightgoldenrodyellow": "#fafad2"}, {"lightyellow": "#ffffe0"}, {"cornsilk": "#fff8dc"}, {"beige": "#f5f5dc"}, {"linen": "#faf0e6"}, {"oldlace": "#fdf5e6"}, {"seashell": "#fff5ee"}, {"floralwhite": "#fffaf0"}, {"ivory": "#fffff0"}, {"white": "#ffffff"}, {"snow": "#fffafa"}, {"ghostwhite": "#f8f8ff"}, {"aliceblue": "#f0f8ff"}, {"azure": "#f0ffff"}, {"mintcream": "#f5fffa"}, {"honeydew": "#f0fff0"}, {"whitesmoke": "#f5f5f5"}, {"lavenderblush": "#fff0f5"}, {"mistyrose": "#ffe4e1"}, {"antiquewhite": "#faebd7"}, {"papayawhip": "#ffefd5"}, {"blanchedalmond": "#ffebcd"}, {"bisque": "#ffe4c4"}, {"peachpuff": "#ffdab9"}, {"moccasin": "#ffe4b5"}, {"navajowhite": "#ffdead"}, {"wheat": "#f5deb3"}, {"palegoldenrod": "#eee8aa"}, {"khaki": "#f0e68c"}, {"lightcyan": "#e0ffff"}, {"lavender": "#e6e6fa"}, {"gainsboro": "#dcdcdc"}, {"lightgrey": "#d3d3d3"}, {"thistle": "#d8bfd8"}, {"plum": "#dda0dd"}, {"violet": "#ee82ee"}, {"orchid": "#da70d6"}, {"mediumorchid": "#ba55d3"}, {"mediumpurple": "#9370d8"}, {"mediumslateblue": "#7b68ee"}, {"slateblue": "#6a5acd"}, {"royalblue": "#4169e1"}, {"steelblue": "#4682b4"}, {"cadetblue": "#5f9ea0"}, {"lightslategray": "#778899"}, {"slategray": "#708090"}, {"gray": "#808080"}, {"indianred ": "#cd5c5c"}, {"tomato": "#ff6347"}, {"coral": "#ff7f50"}, {"salmon": "#fa8072"}, {"lightcoral": "#f08080"}, {"darksalmon": "#e9967a"}, {"lightsalmon": "#ffa07a"}, {"sandybrown": "#f4a460"}, {"burlywood": "#deb887"}, {"tan": "#d2b48c"}, {"darkkhaki": "#bdb76b"}, {"yellowgreen": "#9acd32"}, {"greenyellow": "#adff2f"}, {"chartreuse": "#7fff00"}, {"lawngreen": "#7cfc00"}, {"lime": "#00ff00"}, {"limegreen": "#32cd32"}, {"mediumseagreen": "#3cb371"}, {"seagreen": "#2e8b57"}, {"forestgreen": "#228b22"}, {"green": "#008000"}, {"darkgreen": "#006400"}, {"black": "#000000"}, {"maroon": "#800000"}, {"darkred": "#8b0000"}, {"saddlebrown": "#8b4513"}, {"sienna": "#a0522d"}, {"brown": "#a52a2a"}, {"firebrick": "#b22222"}, {"crimson": "#dc143c"}, {"red": "#ff0000"}, {"orangered": "#ff4500"}, {"darkorange": "#ff8c00"}, {"orange": "#ffa500"}, {"goldenrod": "#daa520"}, {"peru": "#cd853f"}, {"chocolate": "#d2691e"}, {"darkgoldenrod": "#b8860b"}, {"olive": "#808000"}, {"olivedrab": "#6b8e23"}, {"darkolivegreen": "#556b2f"}, {"darkslategray": "#2f4f4f"}, {"darkslateblue": "#483d8b"}, {"dimgray": "#696969"}, {"teal": "#008080"}, {"darkcyan": "#008b8b"}, {"lightseagreen": "#20b2aa"}, {"darkturquoise": "#00ced1"}, {"deepskyblue": "#00bfff"}, {"dodgerblue": "#1e90ff"}, {"cornflowerblue": "#6495ed"}, {"darkorchid": "#9932cc"}, {"blueviolet": "#8a2be2"}, {"darkviolet": "#9400d3"}, {"blue": "#0000ff"}, {"mediumblue": "#0000cd"}, {"darkblue": "#00008b"}, {"navy": "#000080"}, {"midnightblue": "#191970"}, {"indigo": "#4b0082"}, {"purple": "#800080"}, {"darkmagenta": "#8b008b"}, {"mediumvioletred": "#c71585"}, {"deeppink": "#ff1493"}, {"magenta": "#ff00ff"}, {"fuchsia": "#ff00ff"}]
      rangy.init();

      originalToolbar = [ '<div contentEditable="false" name="inlineToolbar" class="btn-group" role="group" aria-label="..." style="z-index:9999">',
                            '<button type="button" ng-click="applyClass(\'ite-bold\')" class="btn btn-default btn-sm" data-inline-type="ite-bold" title="bold"><i class="fa fa-bold"></i></button>',
                            '<button type="button" ng-click="applyClass(\'ite-italic\')" class="btn btn-default btn-sm" data-inline-type="ite-italic" title="italic"><i class="fa fa-italic"></i></button>',
                            '<button type="button" ng-click="applyClass(\'ite-underline\')" class="btn btn-default btn-sm" data-inline-type="ite-underline" title="underline"><i class="fa fa-underline"></i></button>',
                            '<button type="button" ng-click="applyClass(\'ite-strikethrough\')" class="btn btn-default btn-sm" data-inline-type="ite-strikethrough" title="strikethrough"><i class="fa fa-strikethrough"></i></button>',
                            '<button type="button" ng-click="openColorPicker()" class="btn btn-default btn-sm" data-inline-type="ite-color"><i class="fa fa-eyedropper" title="colour picker"></i></button>',
                            '<div class="color-picker" ng-show="colorPickerActive">',
                              '<span ng-repeat="colorObj in colors">',
                                '<span ng-click="applyColor((\'ite-\' + color))" ng-repeat="(color, hex) in colorObj | orderBy:key" class="color" style="background-color:{{color}}" ng-mouseover="setColors(color, hex)"></span>',
                              '</span>',
                              '<div class="small">{{activeColor}} {{activeHex}}</div>',
                              // '<input type="text" class="form-control input-sm"/>',
                            '</div>',
                            '<div class="btn-group ng-hide ng-cloak" ng-show="expandImageInput">',
                              '<form name="inlineToolbarImageForm" class="input-group">',
                                '<input id="inline-toolbar-image-url" type="text" url-validator placeholder="image link" ng-model="imageUrl" class="form-control input-sm" required/>',
                              '</form>',
                            '</div>',
                            '<button type="button" ng-click="applyImage()" class="btn btn-default btn-sm" data-inline-type="ite-image" title="add image"><i class="fa fa-image"></i></button>',
                            '<div class="btn-group ng-hide ng-cloak" ng-show="expandLinkInput">',
                              '<form name="inlineToolbarUrlForm" class="input-group">',
                                '<input id="inline-toolbar-link-url" type="text" url-validator placeholder="add url" ng-model="linkUrl" class="form-control input-sm" required/>',
                              '</form>',
                            '</div>',
                            '<button type="button" ng-click="applyLink()" class="btn btn-default btn-sm" data-inline-type="ite-link" title="add hyperlink"><i class="fa fa-link"></i></button>',
                            '<div class="btn-group ng-hide ng-cloak" ng-show="expandEmailInput">',
                              '<form name="inlineToolbarEmailForm" class="input-group">',
                                '<input id="inline-toolbar-email" type="email" placeholder="add email" ng-model="email" class="form-control input-sm" required/>',
                              '</form>',
                            '</div>',
                            '<button type="button" ng-click="applyEmail()" class="btn btn-default btn-sm" data-inline-type="ite-email" title="add email link">@</button>',
                            '<button type="button" ng-click="resetSelection()" class="btn btn-default btn-sm" title="reset selection"><i class="fa fa-eraser"></i></button>',
                          '</div>'].join('');



      // Listen for change events to enable binding
      element.on('blur keyup change mouseup', function() {
        $scope.$evalAsync(read);
      });


      element.on('paste', function() {
        pastedContent = event.clipboardData.getData('text/plain');
        if (event.preventDefault) {
          event.stopPropagation();
          event.preventDefault();
        }
        window.document.execCommand('insertText', false, pastedContent);
      });


      // Create or remove toolbar depending on rangy selection
      element.bind('mouseup', function (e) {
        $scope.$evalAsync(function() {
          clickPosition = { 'x' : e.pageX, 'y' : e.pageY};
          var range = rangy.getSelection();
          var start = range.anchorOffset;
          var end = range.focusOffset;

          if (!range.isCollapsed) {
            createToolbar();
          } else {
            removeToolbar();
          }
        });
      });

      // Remove toolbar if the user clicks outside of the element
      element.bind('blur', function (e) {
        removeToolbar();
      });

      // Bind to escape key and delete key to remove the toolbar
      element.bind("keydown", function (e) {
          if (e.keyCode == 27 || e.keyCode == 8 || e.keyCode == 46) {
            removeToolbar('escape');
          }
      });

      var classFinder = function(node, buttonType) {
        if (angular.element(node).hasClass(buttonType)) {
          return true;
        }
        else if (angular.element(node).attr('inline-text-editor') !== undefined && !angular.element(node).hasClass(buttonType)) {
          return false;
        }
        else {
          return classFinder(node.parentNode, buttonType);
        }
      };

      $scope.applyClass = function(cssClass) {
        // this conditional handles the edge case if the user clicks a class button while having link input open
        if (savedSelection && rangy.getSelection().rangeCount == 0) { rangy.restoreSelection(savedSelection); }
        var classApplierModule = rangy.modules.ClassApplier || rangy.modules.CssClassApplier;
        classApplier = rangy.createCssClassApplier(cssClass);
        classApplier.toggleSelection();
        setButtonState();
      };

      $scope.openColorPicker = function() {
        savedSelection = rangy.saveSelection();
        $scope.colorPickerActive = !$scope.colorPickerActive;
      };

      $scope.applyColor = function(color) {
        rangy.restoreSelection(savedSelection);
        classApplier = rangy.createCssClassApplier(color);
        // classApplier.undoToSelection();
        classApplier.applyToSelection();
        $scope.colorPickerActive = false;
        setButtonState();
        removeToolbar('force');
      };

      $scope.setColors = function(color, hex) {
        $scope.activeColor = color
        $scope.activeHex = hex
      };

      $scope.resetSelection = function() {
        // Thanks to Tim Down for this code snippet
        var getComputedDisplay = (typeof window.getComputedStyle != "undefined") ?
          function(el) {
            return window.getComputedStyle(el, null).display;
          } :
          function(el) {
            return el.currentStyle.display;
          };

        var replaceWithOwnChildren = function(el) {
          var parent = el.parentNode;
          while (el.hasChildNodes()) {
              parent.insertBefore(el.firstChild, el);
          }
          parent.removeChild(el);
        }

        var removeSelectionFormatting = function() {
          var sel = rangy.getSelection();

          if (!sel.isCollapsed) {
            for (var i = 0, range; i < sel.rangeCount; ++i) {
              range = sel.getRangeAt(i);

              // Split partially selected nodes
              range.splitBoundaries();

              // Get formatting elements
              var formattingEls = range.getNodes([1], function(el) {
                return el.tagName != "BR" && getComputedDisplay(el) == "inline";
              });

              // Remove the formatting elements
              for (var i = 0, el; el = formattingEls[i++]; ) {
                replaceWithOwnChildren(el);
              }
            }
          }
        }
        removeSelectionFormatting();
      }

      $scope.setImageResizeElements = function($event) {
        clearSelection();

        var target, targetWidth, targetHeight, ratio, overlayWidth, overlayHeight, startPositionX, startPositionY, currentPositionX, currentPositionY;
        target = angular.element($event.target)
        targetWidth = $event.target.width;
        targetHeight = $event.target.height;
        ratio = targetHeight / targetWidth;

        // hide the source image, and set up the nodes required for resizing the image
        angular.element($event.target).addClass('ite-display-none');
        target.after('<div tabindex="0" id="ite-image-resize-overlay" style="width:'+targetWidth+'px; height:'+targetHeight+'px;" contentEditable="false"><img src="'+$event.target.currentSrc+'" height="100%" width="100%"/><div draggable="true" id="ite-image-handle-se" contentEditable="false"></div></div>');
        seHandle = document.getElementById('ite-image-handle-se');
        overlay = document.getElementById('ite-image-resize-overlay');
        overlay.focus();

        var setOverlaySize = function() {
          currentPositionX = event.pageX;
          currentPositionY = event.pageY;

          // Shift key ensures original image dimensions are retained
          if (event.shiftKey) {
            overlayWidth = (targetWidth + (currentPositionX - startPositionX));
            overlay.style.width = overlayWidth + "px";
            overlayHeight = ((targetHeight + (currentPositionY - startPositionY)) * ratio)
            overlay.style.height = overlayHeight + "px";
          } else if ((targetWidth + (currentPositionX - startPositionX)) > 0) {
            overlayWidth = (targetWidth + (currentPositionX - startPositionX));
            overlay.style.width = overlayWidth + "px";
            overlayHeight = (targetHeight + (currentPositionY - startPositionY));
            overlay.style.height = overlayHeight + "px";
          }
        }

        var tearDownAndReset = function() {
          // Set final height for image
          $event.target.width = targetWidth;
          $event.target.height = targetHeight;
          // Remove resize nodes
          overlay.parentNode.removeChild(overlay);
          // show the orginal image
          angular.element($event.target).removeClass('ite-display-none');
          $scope.$evalAsync(read);
        }

        seHandle.addEventListener('dragstart', function(event) {
          startPositionX = event.pageX;
          startPositionY = event.pageY;
          return false;
        },false);

        seHandle.addEventListener('drag', function(event, ui) {
          setOverlaySize();
          return false;
        },false);

        seHandle.addEventListener('dragend', function(event) {
          targetHeight = overlayHeight;
          targetWidth = overlayWidth;
          return false;
        },false);

        angular.element(overlay).on('blur', function() {
          tearDownAndReset();
        });

      };


      $scope.applyImage = function() {
        // this checks if the user has typed in a link or not
        if ($scope.expandImageInput) {

          var httpRegex = new RegExp('http(s)?://', 'g', 'i');
          $scope.imageUrl = $scope.imageUrl.match(httpRegex) ? $scope.imageUrl : 'http://'+$scope.imageUrl;

          rangy.restoreSelection(savedSelection);

          if (angular.element(rangy.getSelection().focusNode).attr('src')) {
            $scope.imageUrl = $scope.linkUrl.match(httpRegex) ? $scope.imageUrl : 'http://'+$scope.imageUrl;
            angular.element(rangy.getSelection().focusNode).attr('src', $scope.imageUrl);

          } else if($scope.inlineToolbarImageForm.$valid) {
            // generate random hex id. This is not intended to be perfectly colision free, however the likelihood is incredibly low, and this is only used for element compilation
            var id = (Math.random()*0xFFFFFF<<0).toString(16);
            classApplier = rangy.createCssClassApplier('ite-image', {elementTagName: 'img', elementAttributes: {'src':$scope.imageUrl, 'id':id, 'ng-click':'setImageResizeElements($event)'}});
            classApplier.toggleSelection();
            var img = document.getElementById(id);
            $compile(img)($scope);
          }
          $scope.imageUrl = '';
        }
        // If the user hasn't entered an image (i.e. they have simply clicked the image button the first time to show the input),
        // then we need to save the selection so we can resore it later since it will be wiped once the image input is focused
        else {
          savedSelection = rangy.saveSelection();
          $scope.imageUrl = linkFinder(rangy.getSelection().focusNode) || '';
        }
        $scope.expandImageInput = !$scope.expandImageInput;

        if ($scope.expandImageInput) {
          $timeout(function() {
            var el = document.getElementById('inline-toolbar-image-url')
            el.focus();
            angular.element(el).bind('blur', function (e) {
             removeToolbar();
            });
          },0);
        }

        setButtonState();
      };

      $scope.applyLink = function() {
        // this checks if the user has typed in a link or not
        if ($scope.expandLinkInput) {

          var httpRegex = new RegExp('http(s)?://', 'g', 'i');
          $scope.linkUrl = $scope.linkUrl.match(httpRegex) ? $scope.linkUrl : 'http://'+$scope.linkUrl;

          rangy.restoreSelection(savedSelection);

          if (angular.element(rangy.getSelection().focusNode).attr('href')) {
            $scope.linkUrl = $scope.linkUrl.match(httpRegex) ? $scope.linkUrl : 'http://'+$scope.linkUrl;
            angular.element(rangy.getSelection().focusNode).attr('href', $scope.linkUrl);

          } else if($scope.inlineToolbarUrlForm.$valid) {
            classApplier = rangy.createCssClassApplier('ite-link', {elementTagName: 'a', elementAttributes: {'href':$scope.linkUrl, 'target':'_blank'}});
            classApplier.toggleSelection();
          }
          $scope.linkUrl = '';
        }
        // If the user hasn't entered a link (i.e. they have simply clicked the link button the first time to show the input),
        // then we need to save the selection so we can resore it later since it will be wiped once the link input is focused
        else {
          savedSelection = rangy.saveSelection();
          $scope.linkUrl = linkFinder(rangy.getSelection().focusNode) || '';
        }
        $scope.expandLinkInput = !$scope.expandLinkInput;

        if ($scope.expandLinkInput) {
          $timeout(function() {
            var el = document.getElementById('inline-toolbar-link-url')
            el.focus();
            angular.element(el).bind('blur', function (e) {
             removeToolbar();
            });
          },0);
        }

        setButtonState();
      };

      $scope.applyEmail = function() {
        // this checks if the user has typed in a link or not
        if ($scope.expandEmailInput) {

          var emailRegex = new RegExp('mailto:', 'g', 'i');
          $scope.email = $scope.email.match(emailRegex) ? $scope.email : 'mailto:'+$scope.email;

          rangy.restoreSelection(savedSelection);

          if (angular.element(rangy.getSelection().focusNode).attr('href')) {
            $scope.email = $scope.email.match(emailRegex) ? $scope.email : 'mailto:'+$scope.email;
            angular.element(rangy.getSelection().focusNode).attr('href', $scope.email);

          } else if($scope.inlineToolbarEmailForm.$valid) {
            classApplier = rangy.createCssClassApplier('ite-email', {elementTagName: 'a', elementAttributes: {'href':$scope.email}});
            classApplier.toggleSelection();
          }
          $scope.email = '';
        }
        // If the user hasn't entered a link (i.e. they have simply clicked the link button the first time to show the input),
        // then we need to save the selection so we can resore it later since it will be wiped once the link input is focused
        else {
          savedSelection = rangy.saveSelection();
          $scope.email = linkFinder(rangy.getSelection().focusNode) || '';
          $scope.email = $scope.email.replace('mailto:', '');
        }
        $scope.expandEmailInput = !$scope.expandEmailInput;

        if ($scope.expandEmailInput) {
          $timeout(function() {
            var el = document.getElementById('inline-toolbar-email');
            el.focus();
            angular.element(el).bind('blur', function (e) {
             removeToolbar();
            });
          },0);
        }

        setButtonState();
      };

      var linkFinder = function(node) {
        if (angular.element(node).attr('href')) {
          return angular.element(node).attr('href');
        } else if (angular.element(node).attr('inline-text-editor') !== undefined && !angular.element(node).attr('href')) {
          return false;
        }
        else if (node && node.parentNode) {
          return linkFinder(node.parentNode);
        }
      };


      var createToolbar = function(){
        removeToolbar();
        toolbar = angular.copy(originalToolbar);
        toolbar = $compile(toolbar)($scope);

        angular.element(document.body).after(toolbar);

        toolbar[0].style.position = 'absolute';
        toolbar[0].style.left = clickPosition.x - 50 + 'px';
        toolbar[0].style.top = clickPosition.y + 15 + 'px';

        // Move toolbar to the left if the user clicks at the edge of the screen
        if ((window.outerWidth - clickPosition.x) - angular.element(toolbar).prop('offsetWidth') < 125) {
          toolbar[0].style.left = null;
          toolbar[0].style.right = (window.outerWidth - clickPosition.x) - 50 + 'px';
        }

        angular.element(toolbar).bind('mouseout', function (e) {
          overToolbar = false;
        });
        angular.element(toolbar).bind('mouseover', function (e) {
          overToolbar = true;
        });
        angular.element(document.getElementById('inline-toolbar-link-url')).bind("keydown", function (e) {
          if (e.keyCode == 27) {
            removeToolbar('escape');
          }
        });

        setButtonState();
      };

      var removeToolbar = function(escape){
        if (!overToolbar || (overToolbar && escape)) {
          $scope.expandLinkInput = false;
          $scope.expandEmailInput = false;
          $scope.expandImageInput = false;
          $scope.colorPickerActive = false;
          angular.element(toolbar).remove();
        }
      };

      var setButtonState = function() {
        var toolbarElements = angular.element(toolbar).children();

        for(i=0; i<toolbarElements.length; i++) {
          var buttonType = angular.element(toolbarElements[i]).attr('data-inline-type');
          if (classFinder(rangy.getSelection().focusNode, buttonType)){
            angular.element(toolbarElements[i]).addClass('active');
          } else {
            angular.element(toolbarElements[i]).removeClass('active');
          }
        }
      };

      var clearSelection = function() {
        // Thanks to Tim Down
        var sel;
        if ( (sel = document.selection) && sel.empty ) {
          sel.empty();
        } else {
          if (window.getSelection) {
            window.getSelection().removeAllRanges();
          }
          var activeEl = document.activeElement;
          if (activeEl) {
            var tagName = activeEl.nodeName.toLowerCase();
            if ( tagName == "textarea" || (tagName == "input" && activeEl.type == "text") ) {
              // Collapse the selection to the end
              activeEl.selectionStart = activeEl.selectionEnd;
            }
          }
        }
      }

    }
  };
}

inlineTextEditor.$inject = ["$sce", "$compile", "$timeout", "$window", "$sanitize"];

function urlValidator() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      urlValidator: '=',
      ngModel: '='
    },
    link: function ($scope, element, attrs, ctrl) {
      element.on("keyup", function(event) {

        var regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.\-\?\=\&]*)$/i;

        // Set validity of the field controller
        if ($scope.ngModel && $scope.ngModel.match(regex)) {
          $scope.$apply(function() {
            ctrl.$setValidity("hyperlink", true);
          });
        } else {
          $scope.$apply(function() {
            ctrl.$setValidity("hyperlink", false);
          });
            }

      });
    }
  };
}

angular
  .module('InlineTextEditor')
  .directive('inlineTextEditor', inlineTextEditor)
  .directive('urlValidator', urlValidator)
  ;
})();
