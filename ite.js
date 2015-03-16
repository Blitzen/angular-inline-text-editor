(function () {

angular.module( 'InlineTextEditor', []);

function inlineTextEditor($sce, $compile, $timeout){
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function($scope, element, attrs, ngModel) {

      if (!ngModel) { return; }
      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html(ngModel.$viewValue || '');
      };
      // Write data to the model
      function read() {
        var html = element.html();
        ngModel.$setViewValue(html);
      }


      $scope.linkUrl = null;
      $scope.expandLinkInput = false;
      var savedSelection, clickPosition, overToolbar, originalToolbar, toolbar;
      rangy.init();

      originalToolbar = [ '<div contentEditable="false" name="inlineToolbar" class="btn-group" role="group" aria-label="...">',
                            '<button type="button" ng-click="applyClass(\'ite-bold\')" class="btn btn-default" data-inline-type="ite-bold"><i class="fa fa-bold"></i></button>',
                            '<button type="button" ng-click="applyClass(\'ite-italic\')" class="btn btn-default" data-inline-type="ite-italic"><i class="fa fa-italic"></i></button>',
                            '<button type="button" ng-click="applyClass(\'ite-underline\')" class="btn btn-default" data-inline-type="ite-underline"><i class="fa fa-underline"></i></button>',
                            '<button type="button" ng-click="applyClass(\'ite-strikethrough\')" class="btn btn-default" data-inline-type="ite-strikethrough"><i class="fa fa-strikethrough"></i></button>',
                            '<div class="btn-group ng-hide ng-cloak" ng-show="expandLinkInput">',
                              '<form name="inlineToolbarUrlForm" class="input-group">',
                                '<input id="inline-toolbar-link-url" type="text" url-validator placeholder="add url, then hit enter" ng-model="linkUrl" class="form-control" required/>',
                              '</form>',
                            '</div>',
                            '<button type="button" ng-click="applyLink()" class="btn btn-default" data-inline-type="ite-link"><i class="fa fa-link"></i></button>',
                          '</div>'].join('');

      // Listen for change events to enable binding
      element.on('blur keyup change mouseup', function() {
        $scope.$evalAsync(read);
      });

      // Create or remove toolbar depending on rangy selection
      element.bind('mouseup', function (e) {
        clickPosition = { 'x' : e.pageX, 'y' : e.pageY};
        var range = rangy.getSelection();
        var start = range.anchorOffset;
        var end = range.focusOffset;

        if (end - start !== 0) {
          createToolbar();
        } else {
          removeToolbar();
        }
      });

      // Remove toolbar if the user clicks outside of the element
      element.bind('blur', function (e) {
        removeToolbar();
      });

      $scope.applyClass = function(cssClass) {
        // this conditional handles the edge case if the user clicks a class button while having link input open
        if (savedSelection) { rangy.restoreSelection(savedSelection); }
        var classApplierModule = rangy.modules.ClassApplier || rangy.modules.CssClassApplier;
        classApplier = rangy.createCssClassApplier(cssClass);
        classApplier.toggleSelection();
        setButtonState();
      };

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

      $scope.applyLink = function() {
        // this checks if the user has typed in a link or not
        if ($scope.expandLinkInput) {

          var httpRegex = new RegExp('http://', 'g', 'i');
          $scope.linkUrl = $scope.linkUrl.match(httpRegex) ? $scope.linkUrl : 'http://'+$scope.linkUrl;

          rangy.restoreSelection(savedSelection);

          if (angular.element(rangy.getSelection().focusNode).attr('href')) {
            $scope.linkUrl = $scope.linkUrl.match(httpRegex) ? $scope.linkUrl : 'http://'+$scope.linkUrl;
            angular.element(rangy.getSelection().focusNode).attr('href', $scope.linkUrl);

          } else if($scope.inlineToolbarUrlForm.$valid) {
            classApplier = rangy.createCssClassApplier('link', {elementTagName: 'a', elementAttributes: {'href':$scope.linkUrl, 'target':'_blank'}});
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
            document.getElementById('inline-toolbar-link-url').focus();
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
        else {
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

        setButtonState();
      };

      var removeToolbar = function(){
        if (!overToolbar) {
          $scope.expandLinkInput = false;
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

    }
  };
}

inlineTextEditor.$inject = ["$sce", "$compile", "$timeout"];

function toTrusted($sce){
  return function(text) {
      return $sce.trustAsHtml(text);
  };
}

toTrusted.$inject = ["$sce"];

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
  .filter('toTrusted', toTrusted)
  ;
})();
