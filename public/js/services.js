'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular

.module('whatif.services', [])

.value('version', '0.3')

.service('getMessages',function($http){
	return {
		async: function() {
			return $http.get('/api/messages')
		        // .success(function(data) {
		        //     this.name = 'Whatif...!';
		        //     this.messages = data;
		        //     console.log('service: ',data);
		        // })
		        // .error(function(data) {
		        //     console.log('Error: ' + data);
		        // });
		    }
    }
})

.service('Search',function($http){
	var vm = {};
	vm.searchdata = {};
	return {
		setResults: function(searchForm) {
			//use the promise to set attr, then use it for next function
			$http({
				method      : 'POST',
				url         : '/api/messages/search',
				data        : searchForm,
				header      : { 'Content-Type': 'application/json' }
			})
			// .success(function(data){
			// 	vm.searchdata = data;
			// 	console.log('results set',data);
			// })
			// .error(function(data) {
   //  			//console.log('Error: ' + data);
   //  		})
    		;
			
		},
		getResults: function() {
			console.log('getResults: ',vm.searchdata);
			// if(vm.searchdata){
			// 	return vm.searchdata;
			// }
			// else {
				return $http.get('/api/messages')
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
				url         : '/api/messages/search',
				data        : searchCriteria,
				header      : { 'Content-Type': 'application/json' }
			})
			.success(function(data){
				results = data;
				//console.log('results set',data);
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
;