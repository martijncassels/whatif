'use strict';

var whatif = angular.module('whatif',[
    'ngRoute',
    'whatif.controllers',
    'whatif.Logincontrollers',
    'whatif.Factorycontrollers',
    'whatif.Messagecontrollers',
    'whatif.Profilecontrollers',
    'whatif.filters',
    'whatif.services',
    'whatif.directives',
    'chart.js',
    'ui.bootstrap',
    'underscore',
    'vcRecaptcha']);

whatif
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {templateUrl: 'partials/home/home', controller: 'MsgFrontPageCtrl', controllerAs: 'vm', access: {restricted: false}})
        // .when('/home', {templateUrl: 'partials/home/home', controller: 'MsgNewCtrl', controllerAs: 'vm'})
        .when('/admin', {templateUrl: 'partials/admin/admin', controller: 'AdminCtrl', controllerAs: 'vm', access: {restricted: true}})
        .when('/messages', {templateUrl: 'partials/msg/messages', controller: 'AppCtrl', controllerAs: 'vm', access: {restricted: false}})
        .when('/messages/new', {templateUrl: 'partials/msg/newmessage', controller: 'MsgNewCtrl', controllerAs: 'vm', access: {restricted: false}})
        .when('/messages/search', {templateUrl: 'partials/msg/messages', controller: 'SearchCtrl', controllerAs: 'vm', access: {restricted: false}})
        .when('/messages/view/:entity/:id', {templateUrl: 'partials/msg/viewmessage', controller: 'MsgViewCtrl', controllerAs: 'vm', access: {restricted: false}})
        .when('/factories',{templateUrl: 'partials/fac/factories', controller: 'FactoryCtrl', controllerAs: 'vm', access: {restricted: false}})
        .when('/factories/view/:id',{templateUrl: 'partials/fac/viewfactory', controller: 'FacViewCtrl', controllerAs: 'vm', access: {restricted: false}})
        .when('/factories/update/:id',{templateUrl: 'partials/fac/factoryupdate', controller: 'FacUpdateCtrl', controllerAs: 'vm', access: {restricted: true}})
        .when('/profiles', {templateUrl: 'partials/pro/profiles', controller: 'ProfileCtrl', access: {restricted: false}})
        .when('/profiles/view/:id', {templateUrl: 'partials/pro/viewprofile', controller: 'PrfViewCtrl', access: {restricted: false}})
        .when('/profile/update/:id', {templateUrl: 'partials/pro/profileupdate', controller: 'PrfUpdateCtrl', access: {restricted: true}})
        .when('/:entity/update/:id', {templateUrl: 'partials/msg/messageupdate', controller: 'MsgUpdateCtrl', controllerAs: 'vm', access: {restricted: true}})
        .when('/login', {templateUrl: 'partials/login/login', controller: 'loginController', access: {restricted: false}})
        .when('/logout', {controller: 'logoutController', access: {restricted: false}})
        .when('/register', {templateUrl: 'partials/login/register', controller: 'registerController', access: {restricted: false}})
        .otherwise({redirectTo: '/home', access: {restricted: false}});
    $locationProvider.html5Mode(true);
}])
// .config(function (reCAPTCHAProvider) {
//     // required: please use your own key :)
//     reCAPTCHAProvider.setPublicKey('6LfOCjMUAAAAAHMViY5YidDnok6bo260mHfzumud');

//     // optional: gets passed into the Recaptcha.create call
//     reCAPTCHAProvider.setOptions({
//         theme: 'clean'
//     });
// })
.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(data){
        //$rootScope.isLoggedIn = data.data.status;
        if (next.access.restricted && !AuthService.isLoggedIn()){
        //if (!AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
})
;
