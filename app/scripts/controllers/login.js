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

    $(".s-username-input input").bind('input', function () {
        $(this).val($(this).val().replace(/\s/g, '_'));     
        var username = $.trim($(this).val());
        
        if (/^[a-z][a-zA-Z0-9_.]{0,24}$/.test(username)) { 
            if (username.length < 3) {
                $('.s-username-input').removeClass('error');
                $('.s-username-input').find('i').removeClass().hide();
            }
            if (username.length >= 3) { 
                $('.s-username-input').find('i').addClass('loading').show();
                AuthenticationService.checkUsername({'username': username}).then(function(data) {
                    if(data.success) {
                        $('.s-username-input').addClass('error');
                        $('.s-username-input').find('i').removeClass().addClass('icon cancel fg-red').show();
                    } else {
                        $('.s-username-input').removeClass('error');
                        $('.s-username-input').find('i').removeClass().addClass('icon check fg-green').show();
                    }            
                }, function(error) {
                                    
                }).catch(function(e) {
                                    
                }).finally(function() {
    
                });
            }
        } else {
            if(username == "") {
                $('.s-username-input').find('i').removeClass().hide();
            }
        }
    });
});
