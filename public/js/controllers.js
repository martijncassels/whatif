'use strict';

/* Controllers */
angular

.module('whatif.controllers',[])

.controller('MainCtrl', MainCtrl)
.controller('PathCtrl', PathCtrl)
.controller('AppCtrl', AppCtrl)
.controller('SearchCtrl', SearchCtrl);

MainCtrl.$inject = ['$scope','$rootScope','AuthService', '$route'];
PathCtrl.$inject = ['$scope', '$route'];
AppCtrl.$inject = ['$scope','$rootScope','$http', 'Search', '$location', 'Advert', 'AuthService'];
SearchCtrl.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location', 'Search', 'AuthService', '$route'];

function MainCtrl($scope,$rootScope,AuthService,$route) {
    var vm = this;
    vm.title = 'Whatif...!';
    vm.templateurl = '';

    $scope.$on('$locationChangeSuccess', function(){
      vm.templateurl = $route.current.templateUrl;
    });
    $scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
      $rootScope.isLoggedIn = isLoggedIn;
    });
}

function PathCtrl($scope,$route) {
    var vm = this;
    vm.templateurl = '';
    $scope.$on('$locationChangeSuccess', function(){
      vm.templateurl = $route.current.templateUrl
    });
}

function AppCtrl($scope,$rootScope,$http,Search,$location,Advert,AuthService) {
  	var vm = this;
    vm.currentpage = 1;
    vm.limit = 10;
    vm.totalmsgs = 0;
    vm.totalpages = 0;
    vm.formmodel = {};
    vm.searchForm = {};
    vm.hot = 40; // amount of hits to be 'hot'

    // vm.activeuser = {};
    // // vm.isLoggedIn = AuthService.isLoggedIn();
    // AuthService.getUserStatus().then(function(data){
    //     if(AuthService.isLoggedIn()) {
    //       vm.activeuser = data.data.user;
    //       //$rootScope.activeuser = data.data.user;
    //       vm.formmodel.author = vm.activeuser.username;
    //       vm.formData.author.$dirty = true;
    //       vm.formData.author.$pristine = false;
    //       vm.formData.author.$isvalid = true;
    //     }
    // });

    // Search.getCount().success(function(data){
    //   vm.totalmsgs = data;
    // })

    // Advert.getAdvert().success(function(data){
    //   vm.advert = data;
    // })

    //console.log($location.host());

    Search.getResults(vm.currentpage-1,vm.limit)
    .success(function(data){
      //if($location.host()=='whatif.martijncassels.nl') {
      // if($location.host()=='localhost') {
      //   Advert.getAdvert().success(function(data){
      //     vm.adverts = data.items[0];
      //   }).catch(function(err){
      //     vm.error = err;
      //   });
      // }
        //console.log(data);
        vm.messages = data.docs;
        vm.messages.splice(4,0,{
          '_id':null,
          "__v":0,
          "hits":0,
          "isfrontpage":false,
          "iscomment":false,
          "isfactory":false,
          "isadvert":true,
          "tags":null,
          "members":null,
          "childs":null,
          "isparent":true,
          "lastupdate":new Date().toISOString(),
          "creationdate":new Date().toISOString(),
          "author":"",
          // "body":vm.adverts.direct_url,
          // "title":vm.adverts.title
          "body":"",
          "title":""
        });
        vm.currentpage = data.page;
        vm.totalmsgs = data.total;
        vm.totalpages = data.pages;
    })
    .error(function(err){
        console.log(err);
        vm.error = data;
    });

    $scope.$on('search',
     function(event){
        Search.getResults(vm.currentpage-1,vm.limit)
        .success(function(data){
            //console.log(data);
            vm.messages = data.docs;
            vm.currentpage = data.page;
            vm.totalmsgs = data.total;
            vm.totalpages = data.pages;
            vm.searchvalue = data.searchvalue;
        })
        .error(function(err){
            console.log(err);
            vm.error = data;
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
          vm.error = data;
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
                    //vm.messages = data;
                    vm.messages = data.docs;
                    vm.currentpage = data.page;
                    vm.totalmsgs = data.total;
                    vm.totalpages = data.pages;
                    //console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    vm.error = data;
                });
        }
    };

    // delete a message
    vm.deleteMessage = function(id) {
        $http.delete('/api/messages/' + id + '/' + (vm.currentpage-1) + '/' + vm.limit)
            .success(function(data) {
                //vm.messages = data;
                //$location.path('/messages');
                //console.log(data);
                vm.messages = data.docs;
                vm.currentpage = data.page;
                vm.totalmsgs = data.total;
                vm.totalpages = data.pages;
            })
            .error(function(data) {
                console.log('Error: ' + data);
                vm.error = data;
            });
    };

    // Create a comment
    vm.createComment = function(child,id) {
      console.log(vm.currentpage);
        $http.post('/api/comments/' + id + '/' + (vm.currentpage-1) + '/' + vm.limit, child.form)
            .success(function(data) {
                child.form = {};
                vm.messages = data.docs;
                vm.currentpage = data.page;
                vm.totalmsgs = data.total;
                vm.totalpages = data.pages;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
                vm.error = data;
            });
    };

    // delete a comment
    vm.deleteComment = function(id) {
        $http.delete('/api/comments/' + id + '/' + (vm.currentpage-1) + '/' + vm.limit)
            .success(function(data) {
                //vm.messages = data;
                //console.log(data);
                vm.messages = data.docs;
                vm.currentpage = data.page;
                vm.totalmsgs = data.total;
                vm.totalpages = data.pages;
            })
            .error(function(data) {
                console.log('Error: ' + data);
                vm.error = data;
            });
    };

    // add a thumb
    vm.addThumb = function(id,uid,page,limit) {
      if(uid) {
        $http.post('/api/messages/thumbs/' + id + '/' + uid + '/' + page + '/' + limit)
            .success(function(data) {
              //console.log(data);
                vm.messages = data.docs;
                //$location.path('/messages');
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
                vm.error = data;
            });
          }
    };

    // add a thumb
    vm.removeThumb = function(id,uid,page,limit) {
      if(uid) {
        $http.delete('/api/messages/thumbs/' + id + '/' + uid + '/' + page + '/' + limit)
            .success(function(data) {
              //console.log(data);
                vm.messages = data.docs;
                //$location.path('/messages');
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
                vm.error = data;
            });
          }
    };
}

function SearchCtrl($scope, $rootScope, $http ,$routeParams,$location,Search,AuthService,$route) {
    var vm = this;
    $scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
      vm.isLoggedIn = isLoggedIn;
      AuthService.getUserStatus().then(function(data){
          if(AuthService.isLoggedIn()) {
            $rootScope.activeuser = data.data.user;
          }
      });
    });
    vm.templateurl = '';
    // $scope.$watch( $location, function(loc){
    //   vm.location = loc.path().split('/',2)[1]; //use second index since path starts with a slash
    // });
    $scope.$on('$locationChangeSuccess', function(){
      //vm.location = $location.path().split('/',2)[1]; //use second index since path starts with a slash
      vm.templateurl = $route.current.templateUrl
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
