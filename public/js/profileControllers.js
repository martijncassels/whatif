angular.module('whatif.controllers')
//function ProfileCtrl($scope, $http) {
.controller('ProfileCtrl', ['$scope', '$http',function($scope, $http) {
    $http.get('/api/profiles')
        .success(function(data) {
            $scope.profiles = data;
            //console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createProfile = function() {
        $http.post('/api/profiles', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.profiles = data;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteProfile = function(id) {
        $http.delete('/api/profiles/' + id)
            .success(function(data) {
                $scope.profiles = data;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
//}
}])
//MyCtrl1.$inject = [];

//function PrfViewCtrl($scope, $http, $routeParams) {
.controller('PrfViewCtrl', ['$scope', '$http', '$routeParams', '$location',function($scope, $http, $routeParams, $location) {
    $scope.labels = [];
    $scope.data = [];
    $http.get('/api/profiles/' + $routeParams.id)
        .success(function(data) {
            $scope.profiles = data;
            angular.forEach($scope.profiles.skills,function(value,key){
                $scope.labels.push(value.name);
                $scope.data.push(value.value)
            });
            $scope.series = ['values'];

            //$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
            $scope.options = {
                scales: {
                    yAxes: [{
                        ticks : {
                            min: 0,
                            max: 6,
                            stepSize: 1
                        } 
                    }]
                }
            };
            $scope.options2 = {
                scale: {
                    ticks : {
                        min: 0,
                        max: 6,
                        stepSize: 1
                    } 
                }
            };
            //console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    // $scope.viewProfile = function(id) {
    //     $http.post('/api/profiles/' + id)
    //         .success(function(data) {
    //             $scope.formData = {}; // clear the form so our user is ready to enter another
    //             $scope.profiles = data;
    //             //console.log(data);
    //         })
    //         .error(function(data) {
    //             console.log('Error: ' + data);
    //         });
    // };

    // when submitting the add form, send the text to the node API
    // $scope.createProfile = function() {
    //     $http.post('/api/profiles', $scope.formData)
    //         .success(function(data) {
    //             $scope.formData = {}; // clear the form so our user is ready to enter another
    //             $scope.profiles = data;
    //             //console.log(data);
    //         })
    //         .error(function(data) {
    //             console.log('Error: ' + data);
    //         });
    // };

    // delete a todo after checking it
    $scope.deleteProfile = function(id) {
        $http.delete('/api/profiles/' + id)
            .success(function(data) {
                $scope.profiles = data;
                $location.path('/profiles');
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
//}
}])
//MyCtrl1.$inject = [];

//function PrfUpdateCtrl($scope, $http, $routeParams) {
.controller('PrfUpdateCtrl', ['$scope', '$http', '$routeParams',function($scope, $http, $routeParams) {
    //$scope.formData4 = {};
    $http.get('/api/profiles/' + $routeParams.id)
        .success(function(data) {
            $scope.profile = data;

            $http.get('/api/factories')
                .success(function(data2) {
                    $scope.factories = data2;
                })
                .error(function(data2) {
                    console.log('Error: ' + data2);
                });
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    

    $scope.updateProfile = function(id) {
        console.log($scope.formData4);
        $http({
            method      : 'PUT',
            url         : '/api/profiles/' + $routeParams.id,
            data        : $scope.formData4,
            header      : { 'Content-Type': 'application/json' }
            })
            .success(function(data) {
                $scope.formData4 = data;
                $scope.success = 'done updating profile!';
                //console.log(data);
            })
            .error(function(data) {
                $scope.error = 'error updating profile!';
                console.log('Error: ' + data);
            });
    };
//}
}])
//MyCtrl2.$inject = [];