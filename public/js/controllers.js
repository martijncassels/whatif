'use strict';

/* Controllers */
angular

.module('whatif.controllers',[])

.controller('MainCtrl', MainCtrl)
.controller('AppCtrl', AppCtrl)
.controller('SearchCtrl', SearchCtrl);

MainCtrl.$inject = ['$scope','AuthService'];
AppCtrl.$inject = ['$scope','$rootScope','$http', 'Search'];
SearchCtrl.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location', 'Search', 'AuthService'];

function MainCtrl($scope,AuthService) {
    var vm = this;
    vm.title = 'Whatif...!';
    $scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
    vm.isLoggedIn = isLoggedIn;
    });
}

function AppCtrl($scope,$rootScope,$http,Search) {
  	var vm = this;
    vm.currentpage = 1;
    vm.limit = 10;
    vm.totalmsgs = 0;
    vm.totalpages = 0;
    vm.searchresults = false;
    vm.formmodel = {};
    vm.searchForm = {};


    Search.getResults(vm.currentpage-1,vm.limit)
    .success(function(data){
        //console.log(data);
        vm.messages = data.docs;
        vm.currentpage = data.page;
        vm.totalmsgs = data.total;
        vm.totalpages = data.pages;
    })
    .error(function(err){
        console.log(err);
    });

    $scope.$on('search', function(event){
        Search.getResults(vm.currentpage-1,vm.limit)
        .success(function(data){
            //console.log(data);
            vm.messages = data.docs;
            vm.currentpage = data.page;
            vm.totalmsgs = data.total;
            vm.totalpages = data.pages;
        })
        .error(function(err){
            console.log(err);
        });
    });

    $scope.pageChanged = function() {
      Search.getResults(vm.currentpage-1,vm.limit)
      .success(function(data){
          vm.messages = data.docs;
          vm.currentpage = data.page;
          vm.totalmsgs = data.total;
          vm.totalpages = data.pages;
      })
      .error(function(err){
          console.log(err);
      });
    };

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
}

function SearchCtrl($scope, $rootScope, $http ,$routeParams,$location,Search,AuthService) {
    var vm = this;
    $scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
    vm.isLoggedIn = isLoggedIn;
    });

    vm.onSearchClick = function(searchCriteria){
        //searchService.search(searchCriteria);
        Search.setResults(searchCriteria);
        vm.searchvalue = null;
        // No broadcasting directly from controllers!
    };

    // vm.Search = function(searchvalue) {
    //     Search.setResults(vm.searchForm);
    // };

    vm.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };
}
