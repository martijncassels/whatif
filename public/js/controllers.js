'use strict';

/* Controllers */
angular.module('whatif.controllers',[])

.controller('MainCtrl', ['$scope',function($scope) {
    var vm = this;
    vm.title = 'Whatif...!';
}])

.controller('AppCtrl', ['$scope','$rootScope','$http',function($scope,$rootScope,$http) {
  	$scope.formData = {};
    //$scope.formData2 = {};
    //$scope.formData3 = {};
    $scope.searchForm = {};

    // when landing on the page, get all messages and show them
    $http.get('/api/messages')
        .success(function(data) {
            $scope.name = 'Whatif...!';
            $rootScope.messages = data;
            //console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createMessage = function() {
        if($scope.formData.$valid){
            $http.post('/api/messages', $scope.formData)
                .success(function(data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    $rootScope.messages = data;
                    //console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    };

    // $scope.getMessage = function(id) {
    //     $http.get('/api/view/' + id)
    //         .success(function(data) {
    //             $scope.single = true;
    //             $scope.formData3 = data; // populate form
    //             //$scope.message = data;
    //             //console.log(data);
    //         })
    //         .error(function(data) {
    //             console.log('Error: ' + data);
    //         });
    // };

    // delete a message
    $scope.deleteMessage = function(id) {
        $http.delete('/api/messages/' + id)
            .success(function(data) {
                $rootScope.messages = data;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.createComment = function(child,id) {
        $http.post('/api/comments/' + id, child.form)
            .success(function(data) {
                child.form = {};
                $rootScope.messages = data;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteComment = function(id) {
        $http.delete('/api/comments/' + id)
            .success(function(data) {
                $rootScope.messages = data;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}])

.controller('SearchCtrl', ['$scope', '$rootScope', '$http' , '$routeParams',function($scope, $rootScope, $http ,$routeParams) {

    $scope.search = function() {
            //console.log($scope.searchForm);
            $http({
            method      : 'POST',
            url         : '/api/messages/search',
            data        : $scope.searchForm,
            header      : { 'Content-Type': 'application/json' }
            })
            .success(function(data) {
                $scope.searchForm = {}; // clear the form so our user is ready to enter another
                $rootScope.messages = data;
                //$location.path('/messages/search');
            })
            .error(function(data) {
                console.log('Error: ' + data);
            }); 
    };
//}
}])
