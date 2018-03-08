'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('LoginCtrl', function ($rootScope, $scope, $location) {

    if($rootScope.isLoggedIn) {
        $location.path('/');
    }

    $('.menu .item').tab({
        onVisible: function() {
            $(this).find('input[type="text"]').first().focus();
        }
    });

    $scope.validUser = true;

    $scope.processLogin = function(login) {
        $('.login-btn').addClass('loading');
        
        $rootScope.isLoggedIn = true;
        $location.path('/');
    };
});
