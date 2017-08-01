// angular.module('myApp.controllers')

// .controller('FactoryCtrl', ['$scope', '$http', '$routeParams',function($scope, $http, $routeParams) {

// 	$http.get('/api/messages')
//         .success(function(data) {
//             $scope.name = 'Whatif...!';
//             $rootScope.messages = data;
//             console.log(data);
//         })
//         .error(function(data) {
//             console.log('Error: ' + data);
//         });
// }]);

// Here we get the module we created in file one
angular.module('whatif.controllers')

// We are adding a function called Ctrl1
// to the module we got in the line above
.controller('FactoryCtrl', FactoryCtrl)
.controller('FacViewCtrl', FacViewCtrl)
.controller('FacUpdateCtrl',FacUpdateCtrl);

// Inject my dependencies
FactoryCtrl.$inject = ['$scope', '$http', '$routeParams'];
FacViewCtrl.$inject = ['$scope', '$http', '$routeParams'];
FacUpdateCtrl.$inject = ['$scope', '$http', '$routeParams'];

// Now create our controller function with all necessary logic
function FactoryCtrl($scope, $http, $routeParams) {
	var vm = this;

  	$http.get('/api/factories')
        .success(function(data) {
            vm.factories = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    vm.deleteFactory = function(id) {
        $http.delete('/api/factories/' + id)
            .success(function(data) {
                vm.factories = data;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    vm.createFactory = function() {
        if(vm.formData.$valid){
            $http.post('/api/factories', vm.formData)
                .success(function(data) {
                    vm.formData = {}; // clear the form so our user is ready to enter another
                    vm.data = data;
                    //console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    };
}

function FacViewCtrl($scope, $http, $routeParams) {
	var vm = this;
    
    $http.get('/api/factories/' + $routeParams.id)
        .success(function(data) {
            vm.factory = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    vm.viewFactory = function(id) {
        $http.post('/api/factories/' + id)
            .success(function(data) {
                vm.formData = {}; 
                vm.factory = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // when submitting the add form, send the text to the node API
    // vm.createFactory = function() {
    //     $http.post('/api/profiles', vm.formData)
    //         .success(function(data) {
    //             vm.formData = {}; // clear the form so our user is ready to enter another
    //             vm.profiles = data;
    //             //console.log(data);
    //         })
    //         .error(function(data) {
    //             console.log('Error: ' + data);
    //         });
    // };

    // delete a factory 
    vm.deleteFactory = function(id) {
        $http.delete('/api/factories/' + id)
            .success(function(data) {
                vm.factory = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    
}

function FacUpdateCtrl($scope, $http, $routeParams) {
	var vm = this;
    //vm.data.members = [];
    $http.get('/api/factories/' + $routeParams.id)
        .success(function(data) {
            //console.log(data);
            vm.data = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // $http.get('/api/members')
    //     .success(function(data) {
    //         vm.members = data;
    //     })
    //     .error(function(data) {
    //         console.log('Error: ' + data);
    //     });

    vm.updateFactory = function(id) {
        //console.log($scope.formData8);
        $http.put('/api/factories/' + id , $scope.formData8)
            .success(function(data) {
                vm.formData8 = data;
                vm.success = 'done updating message!';
            })
            .error(function(data) {
                vm.error = 'error updating message!';
                console.log('Error: ' + data);
            });
    };

    vm.getMembers = function(val) {
        return $http.get('/api/members/' + val).then(function(response){
            return response.data;
        });
    };

    vm.pushMember = function(val) {
        //console.log(val);
        var newmember = {'_id':val._id,'username':val.username};
        vm.data.members.push(newmember);
        //console.log(vm.data.members);
        vm.selected = [];
    };

    vm.removeMember = function(member) {
        vm.data.members.splice(member,1);
        vm.selected = [];
    };

}