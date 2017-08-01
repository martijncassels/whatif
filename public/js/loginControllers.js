angular.module('whatif.controllers')
//function loginController($scope, $location, AuthService) {
.controller('loginController', ['$scope', '$location', 'AuthService',function($scope, $location, AuthService) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $location.path('/messages');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };
//}
}])
//loginController.$inject = ['$scope', '$location', 'AuthService'];

//function logoutController($scope, $location, AuthService) {
.controller('logoutController', ['$scope', '$location', 'AuthService',function($scope, $location, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };
//}
}])
//logoutController.$inject = ['$scope', '$location', 'AuthService'];

//function registerController($scope, $location, AuthService) {
.controller('registerController', ['$scope', '$location', 'AuthService',function($scope, $location, AuthService) {

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };
//}
}]);
//registerController.$inject = ['$scope', '$location', 'AuthService'];