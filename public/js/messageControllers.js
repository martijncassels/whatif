angular.module('whatif.controllers')

.controller('MsgUpdateCtrl', ['$scope', '$http', '$routeParams',function($scope, $http, $routeParams) {
    $http.get('/api/messages/' + $routeParams.entity + '/' + $routeParams.id)
        .success(function(data) {
            $scope.data = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.updateMessage = function(child,id) {
        $http.put('/api/messages/' + id , $scope.formData5)
            .success(function(data) {
                $scope.formData5 = data;
                $scope.success = 'done updating message!';
            })
            .error(function(data) {
                $scope.error = 'error updating message!';
                console.log('Error: ' + data);
            });
    };

    $scope.createComment = function(child,id) {
        $http.post('/api/comments/' + id, child.formData2)
            .success(function(data) {
                child.formData2 = {};
                $rootScope.messages = data;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.updateComment = function(id) {
        $http.put('/api/comments/' + id , $scope.formData5)
            .success(function(data) {
                //$scope.messages = data;
                $scope.formData5 = data;
                $scope.success = 'done updating message!';
                //console.log(data);
            })
            .error(function(data) {
                $scope.error = 'error updating message!';
                console.log('Error: ' + data);
            });
        $scope.single = false;
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
        $http.post('/api/comments/single/' + id, child.formData2)
            .success(function(data) {
                console.log($scope);
                $scope.form2 = {};
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
