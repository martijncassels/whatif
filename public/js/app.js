'use strict';

var whatif = angular.module('whatif', [
    'ngRoute',
    'whatif.controllers', 
    'whatif.filters', 
    'whatif.services', 
    'whatif.directives',
    'chart.js',
    'ui.bootstrap',
    'underscore']
);

whatif.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {templateUrl: 'partials/home/home', controller: 'AppCtrl', controllerAs: 'vm'})
        .when('/admin', {templateUrl: 'partials/admin/admin', controller: 'AdminCtrl', controllerAs: 'vm'})
        .when('/messages', {templateUrl: 'partials/msg/messages', controller: 'AppCtrl', controllerAs: 'vm'})
        .when('/messages/new', {templateUrl: 'partials/msg/newmessage', controller: 'MsgNewCtrl', access: {restricted: false}})
        .when('/messages/search', {templateUrl: 'partials/msg/messages', controller: 'SearchCtrl', access: {restricted: false}})
        .when('/messages/view/:entity/:id', {templateUrl: 'partials/msg/viewmessage', controller: 'MsgViewCtrl', access: {restricted: false}})
        .when('/factories',{templateUrl: 'partials/fac/factories', controller: 'FactoryCtrl', controllerAs: 'vm', access: {restricted: false}})
        .when('/factories/view/:id',{templateUrl: 'partials/fac/viewfactory', controller: 'FacViewCtrl', controllerAs: 'vm', access: {restricted: false}})
        .when('/factories/update/:id',{templateUrl: 'partials/fac/factoryupdate', controller: 'FacUpdateCtrl', controllerAs: 'vm', access: {restricted: false}})
        .when('/profiles', {templateUrl: 'partials/pro/profiles', controller: 'ProfileCtrl', access: {restricted: false}})
        .when('/profiles/view/:id', {templateUrl: 'partials/pro/viewprofile', controller: 'PrfViewCtrl', access: {restricted: false}})
        .when('/profile/update/:id', {templateUrl: 'partials/pro/profileupdate', controller: 'PrfUpdateCtrl', access: {restricted: false}})
        .when('/:entity/update/:id', {templateUrl: 'partials/msg/messageupdate', controller: 'MsgUpdateCtrl', access: {restricted: false}})
        .when('/login', {templateUrl: 'partials/login/login', controller: 'loginController', access: {restricted: false}})
        .when('/logout', {controller: 'logoutController', access: {restricted: false}})
        .when('/register', {templateUrl: 'partials/login/register', controller: 'registerController', access: {restricted: false}})
        .otherwise({redirectTo: '/home', access: {restricted: false}});
    $locationProvider.html5Mode(true);
  }])
// .run(function ($rootScope, $location, $route, AuthService) {
//   $rootScope.$on('$routeChangeStart',
//     function (event, next, current) {
//       AuthService.getUserStatus()
//       .then(function(data){
//         $rootScope.status = data.data.status;
//         if (next.access.restricted && !AuthService.isLoggedIn()){
//         //if (!AuthService.isLoggedIn()){
//           $location.path('/login');
//           $route.reload();
//         }
//       });
//   });
// })
;