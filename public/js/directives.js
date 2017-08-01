'use strict';

/* Directives */


angular.module('whatif.directives', []).
	directive('appVersion', ['version', function(version) {
    	return function(scope, elm, attrs) {
      		elm.text(version);
    	}
  	}])
	.directive('commentForm', function() {
  		return {
  			restrict: 'E',
    		templateUrl: 'commentForm'
  		};
  	})
  // .directive("dynamicName",[function(){
  //   return {
  //       restrict:"A",
  //       require: ['ngModel', '^form'],
  //       link:function(scope,element,attrs,ctrls){
  //           ctrls[0].$name = scope.$eval(attrs.dynamicName) || attrs.dynamicName;
  //           ctrls[1].$addControl(ctrls[0]);
  //       }
  //     };
  //   }])
  ;
