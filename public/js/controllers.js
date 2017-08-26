'use strict';

/* Controllers */
angular.module('whatif.controllers',[])

.controller('MainCtrl', ['$scope',function($scope) {
    var vm = this;
    vm.title = 'Whatif...!';
}])

.controller('AppCtrl', ['$scope','$rootScope','$http','getMessages',function($scope,$rootScope,$http,getMessages) {
  	var vm = this;
    //vm.formData = {};
    vm.formmodel = {};
    //$scope.formData = {};
    vm.searchForm = {};
    //$scope.searchForm = {};
    //getMessages();

    getMessages.async().then(function(data){
        //$rootScope.messages = data.data;
        vm.messages = data.data;
        //console.log('service in ctrl: ',data.data);
    });

    //when landing on the page, get all messages and show them
    // $http.get('/api/messages')
    //     .success(function(data) {
    //         $scope.name = 'Whatif...!';
    //         $rootScope.messages = data;
    //         //console.log(data);
    //     })
    //     .error(function(data) {
    //         console.log('Error: ' + data);
    //     });

    // when submitting the add form, send the text to the node API
    vm.createMessage = function() {
        if(vm.formData.$valid){
            $http.post('/api/messages', vm.formData)
                .success(function(data) {
                    //vm.formData = {};
                    vm.formmodel = {};
                    vm.formData.$setPristine();
                    vm.formData.$setUntouched();  // clear the form so our user is ready to enter another
                    vm.messages = data;
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
    vm.deleteMessage = function(id) {
        $http.delete('/api/messages/' + id)
            .success(function(data) {
                vm.messages = data;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    vm.createComment = function(child,id) {
        $http.post('/api/comments/' + id, child.form)
            .success(function(data) {
                child.form = {};
                vm.messages = data;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    vm.deleteComment = function(id) {
        $http.delete('/api/comments/' + id)
            .success(function(data) {
                vm.messages = data;
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
