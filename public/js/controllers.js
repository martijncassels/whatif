'use strict';

/* Controllers */
angular

.module('whatif.controllers',[])

.controller('MainCtrl', MainCtrl)
.controller('AppCtrl', AppCtrl)
.controller('SearchCtrl', SearchCtrl);

MainCtrl.$inject = ['$scope','AuthService'];
AppCtrl.$inject = ['$scope','$rootScope','$http', 'Search'];
SearchCtrl.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location', 'Search', 'searchService', 'AuthService'];

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
    //vm.formData = {};
    vm.formmodel = {};
    //$scope.formData = {};
    vm.searchForm = {};
    //$scope.searchForm = {};
    //getMessages();

    // getMessages.async().then(function(data){
    //     //$rootScope.messages = data.data;
    //     vm.messages = data.data;
    //     //console.log('service in ctrl: ',data.data);
    // });

    //get another portions of data on page changed


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

    $scope.$on('search', function(event, args){
        console.log(args);
        vm.searchresults=  true;
        vm.messages = args.docs;
        vm.currentpage = args.page;
        vm.totalmsgs = args.total;
        vm.totalpages = args.pages;
        // args is the search results
    });

    $scope.pageChanged = function() {
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
      };

    //console.log(getSearchResults.getResults());

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
    //

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
}

function SearchCtrl($scope, $rootScope, $http ,$routeParams,$location,Search,searchService,AuthService) {
    var vm = this;
    $scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
    vm.isLoggedIn = isLoggedIn;
    });

    vm.onSearchClick = function(searchCriteria){
        searchService.search(searchCriteria);
        // No broadcasting directly from controllers!
    };

    vm.Search = function(searchvalue) {
            //console.log('modelvalue: ',vm.searchForm.value.$modelValue);
            //console.log('searchvalue: ',searchvalue);
    //         $http({
    //         method      : 'POST',
    //         url         : '/api/messages/search',
    //         data        : vm.searchForm,
    //         header      : { 'Content-Type': 'application/json' }
    //         })
    //         .success(function(data) {
    //             vm.searchForm = {}; // clear the form so our user is ready to enter another
    //             //vm.messages = data;
    //             $rootScope.messages = data;
    //             //$location.path('/messages/search');
    //         })
    //         .error(function(data) {
    //             console.log('Error: ' + data);
    //         });
    // };

        // getSearchResults.async(vm.searchForm).then(function(data){
        //     //$rootScope.messages = data.data;
        //     //vm.messages = data.data;
        //     console.log('service in ctrl: ',data.data);
        // });
        Search.setResults(vm.searchForm);

    };

    vm.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };
}
