/*
angular.module('whatif.controllers')

.controller('MsgUpdateCtrl', ['$scope', '$http', '$routeParams',function($scope, $http, $routeParams) {

    $http.get('/api/messages/' + $routeParams.entity + '/' + $routeParams.id)
        .success(function(data) {
            $scope.data = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.updateMessage = function(id) {
        $http.put('/api/messages/' + id , $scope.form)
            .success(function(data) {
                $scope.form = data;
                $scope.success = 'done updating message!';
            })
            .error(function(data) {
                $scope.error = 'error updating message!';
                console.log('Error: ' + data);
            });
    };

    // $scope.createComment = function(child,id) {
    //     $http.post('/api/comments/' + id, child.form)
    //         .success(function(data) {
    //             child.form = {};
    //             $rootScope.messages = data;
    //             //console.log(data);
    //         })
    //         .error(function(data) {
    //             console.log('Error: ' + data);
    //         });
    // };

    $scope.updateComment = function(id) {
        $http.put('/api/comments/' + id , $scope.form)
            .success(function(data) {
                $scope.form = data;
                $scope.success = 'done updating message!';
            })
            .error(function(data) {
                $scope.error = 'error updating message!';
                console.log('Error: ' + data);
            });
    };

}])

.controller('MsgViewCtrl', ['$scope', '$http', '$routeParams', '$location',function($scope, $http, $routeParams, $location) {
    //$scope.message = {};
    $http.get('/api/messages/' + $routeParams.entity + '/' + $routeParams.id)
        .success(function(data) {
            $scope.message = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.createComment = function(child,id) {
        $http.post('/api/comments/single/' + id, child.form)
            .success(function(data) {
                //console.log($scope);
                child.form = {};
                $scope.form = {};
                $scope.message = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

    };

    $scope.deleteComment = function(id) {
        $http.delete('/api/comments/single/' + id)
            .success(function(data) {
                $scope.message = data;
                location.path('/messages');
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}])

.controller('MsgNewCtrl', ['$scope', '$http', '$routeParams',function($scope, $http, $routeParams) {

    $scope.formData = {};

    $scope.createMessage = function() {
        if($scope.form.$valid){
            $http.post('/api/messages', $scope.formData)
                .success(function(data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    $scope.messages = data;
                    //console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    };


}])
*/
angular

.module('whatif.Messagecontrollers',[])

.controller('MsgUpdateCtrl', MsgUpdateCtrl)
.controller('MsgViewCtrl', MsgViewCtrl)
.controller('MsgNewCtrl', MsgNewCtrl)
.controller('MsgFrontPageCtrl', MsgFrontPageCtrl);

MsgUpdateCtrl.$inject = ['$scope', '$http', '$routeParams'];
MsgViewCtrl.$inject = ['$scope', '$http', '$routeParams', '$location','AuthService'];
MsgNewCtrl.$inject = ['$scope', '$http', '$routeParams', '$location'];
MsgFrontPageCtrl.$inject = ['$scope', '$http', '$routeParams', '$location','AuthService', 'Search'];

function MsgUpdateCtrl($scope, $http, $routeParams) {
    var vm = this;
    //vm.form = {};

    $http.get('/api/messages/' + $routeParams.entity + '/' + $routeParams.id)
        .success(function(data) {
            vm.message = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    vm.updateMessage = function(id) {
        $http.put('/api/messages/' + id , $scope.form)
            .success(function(data) {
                vm.form = data;
                vm.success = 'done updating message!';
            })
            .error(function(data) {
                vm.error = 'error updating message!';
                console.log('Error: ' + data);
            });
    };

    // vm.createComment = function(child,id) {
    //     $http.post('/api/comments/' + id, child.form)
    //         .success(function(data) {
    //             child.form = {};
    //             $rootScope.messages = data;
    //             //console.log(data);
    //         })
    //         .error(function(data) {
    //             console.log('Error: ' + data);
    //         });
    // };

    vm.updateComment = function(id) {
        $http.put('/api/comments/' + id , $scope.form)
            .success(function(data) {
              if (data.kind) {
                vm.error = 'Message or comment could not be updated!';
              }
              else {
                $scope.form = data; //need to get rid of this
                vm.success = 'done updating message!';
              }
            })
            .error(function(data) {
                vm.error = 'error updating message!';
                console.log('Error: ' + data);
            });
    };

}

function MsgViewCtrl($scope, $http, $routeParams, $location, AuthService) {
    var vm = this;
    vm.isLoggedIn = AuthService.isLoggedIn();
    //vm.formmodel = {};

    $http.get('/api/messages/' + $routeParams.entity + '/' + $routeParams.id)
        .success(function(data) {
            console.log(data);
            (data.kind) ? vm.error = 'Message or comment not found!' : vm.message = data;
        })
        .error(function(data) {
            vm.error = data;
            console.log('Error: ' + data);
        });

    vm.createComment = function(child,id) {
        $http.post('/api/comments/single/' + id, child.form)
            .success(function(data) {
                $scope.form = {};
                child.form = {};
                (data.kind) ? vm.error = 'Comment not be created!' : vm.message = data;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a message
    vm.deleteMessage = function(id) {
        $http.delete('/api/messages/' + id)
            .success(function(data) {
                //vm.message = data;
                $location.path('/messages');
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    vm.deleteComment = function(id) {
        $http.delete('/api/comments/single/' + id)
            .success(function(data) {
                (data.kind) ? vm.error = 'Comment could not be deleted!' : vm.message = data;
                //$location.path('/messages');
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}

function MsgNewCtrl($scope, $http, $routeParams,$location) {
    var vm = this;
    vm.formData = {};

    vm.createMessage = function() {
      //console.log(vm.formData);
        if(vm.formData.$valid){
            $http.post('/api/messages', vm.formData)
                .success(function(data) {
                    vm.formData = {}; // clear the form so our user is ready to enter another
                    (data.kind) ? vm.error = 'Message could not be created!' : vm.message = data;
                    //console.log(data);
                    $location.path('/messages');
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        //console.log('message created!');
        }
    };
}

function MsgFrontPageCtrl($scope, $http, $routeParams,$location, AuthService, Search) {
    var vm = this;
    vm.isLoggedIn = AuthService.isLoggedIn();

    Search.getFrontPage()
    .success(function(data){
        //console.log(data);
        vm.messages = data;
    })
    .error(function(err){
        console.log(err);
    });

    $scope.$on('search', function(event, args){
        //console.log(args);
        vm.messages = args;
        // args is the search results
    });

    // $http.get('/api/frontpage')
    //     .success(function(data){
    //         vm.messages = data;
    //     })
    //     .error(function(data){
    //         console.log('Error: ' + data);
    //     });
}
