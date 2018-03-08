'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('LoginCtrl', function ($rootScope, $scope, $location, localStorageService, AuthenticationService) {

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
        
        AuthenticationService.processLogin(login).then(function(data) {
            if(data.success) {
                localStorageService.set('userProfile', data.results);
                $rootScope.isLoggedIn = true;
                $location.path('/');
            } else {
                $scope.validUser = false;
            }
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {
            $('.login-btn').removeClass('loading');
        });                        
    };

    $scope.processSignup = function(signup) {
        var o = {
            'username': signup.username,
            'password': signup.password,
            'fname': signup.fname ,
            'lname': signup.lname,
            'email': signup.email
        };      

        $('.signup-btn').addClass('loading');
        AuthenticationService.processSignup(o).then(function(data) {                     
            if(data.success) {
                localStorageService.set('userProfile', data.results);
                $rootScope.isLoggedIn = true;
                $location.path('/');
            } else {
                $scope.validUser = false;
            }                  
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {
            $('.signup-btn').removeClass('loading');
        });
    };
});
