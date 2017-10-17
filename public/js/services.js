'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular

.module('whatif.services', [])

.value('version', '0.3')

// .service('getMessages',function($http){
// 	return {
// 		async: function() {
// 			return $http.get('/api/messages')
// 		        // .success(function(data) {
// 		        //     this.name = 'Whatif...!';
// 		        //     this.messages = data;
// 		        //     console.log('service: ',data);
// 		        // })
// 		        // .error(function(data) {
// 		        //     console.log('Error: ' + data);
// 		        // });
// 		    }
//     }
// })

.service('Search',function($http){
	var vm = {};
	vm.searchdata = {};
	return {
		setResults: function(searchForm) {
			//use the promise to set attr, then use it for next function
			$http({
				method      : 'POST',
				url         : '/api/messages/search/0.100',
				data        : searchForm,
				header      : { 'Content-Type': 'application/json' }
			})
			.success(function(data){
				results = data;
				//console.log('results set',data);
			})
			.error(function(data) {
    			//console.log('Error: ' + data);
    		})
    		;

		},
		getResults: function(page,limit) {
			// if(vm.searchdata){
			// 	return vm.searchdata;
			// }
			// else {
				return $http.get('/api/messages/'+page+'.'+limit)
			// }
		},
		getFrontPage: function() {
			// if(vm.searchdata){
			// 	return vm.searchdata;
			// }
			// else {
				return $http.get('/api/frontpage')
			// }
		}
	}
})

.factory('broadcastService', function($rootScope) {
    return {
        send: function(msg, data) {
            $rootScope.$broadcast(msg, data);
        }
    }
})

.factory('searchService', function(broadcastService,$http) {
    return {
        search: function(searchCriteria) {
            // Do some kind of searching
            // then broadcast the results
            var results = {};
            $http({
				method      : 'POST',
				url         : '/api/messages/search/0.100',
				data        : searchCriteria,
				header      : { 'Content-Type': 'application/json' }
			})
			.success(function(data){
				//console.log('from search: '+data.total);
				results = data;
				broadcastService.send('search', results);
			})
			.error(function(data) {
    			//console.log('Error: ' + data);
    		});
            //var results = {1:'boe!'};

        }
    }
})
.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}])
.factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    });

    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }

		// function isAdmin() {
    //   if(user.admin) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }

    function getUserStatus() {
      return $http.get('/status')
      // handle success
      .success(function (data) {
        if(data.status){
          user = true;
        } else {
          user = false;
        }
      })
      // handle error
      .error(function (data) {
        user = false;
      });
    }

    function login(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/login',
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/logout')
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(username, password, firstname, lastname, skill1, skill2, skill3, skill4, skill5) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/register',
        {
          //username: username, password: password
          username:           username,
          password:           password,
          firstname:          firstname,
          lastname:           lastname,
          skills:    [
              {name: '1',value: skill1},
              {name: '2',value: skill2},
              {name: '3',value: skill3},
              {name: '4',value: skill4},
              {name: '5',value: skill5},
              ]
        })
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;
    }
}])
;
