'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('whatif.services', [])
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
});