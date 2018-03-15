'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('LoginCtrl', function ($rootScope, $scope, $cookies, $location, localStorageService, AuthenticationService) {

    if($rootScope.isLoggedIn) {
        $location.path('/');
    }

    $('.menu .item').tab({
        onVisible: function() {
            $(this).find('input[type="text"]').first().focus();
        }
    });
    $scope.validUsername = false;
    $scope.validEmail = false;
    $scope.validUser = true;
    $scope.processLogin = function(login) {
        $('.login-btn').addClass('loading');
        
        AuthenticationService.processLogin(login).then(function(data) {
            if(data.success) {
                localStorageService.set('userProfile', data.results);
                $rootScope.userProfile = localStorageService.get('userProfile');
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
                $cookies.put('new-access', true);
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
            if (username.length < 5) {
                $('.s-username-input').removeClass('error');
                $('.s-username-input').find('i').removeClass().hide();
            }
            if (username.length >= 5) { 
                $('.s-username-input').find('i').addClass('icon loading').show();
                AuthenticationService.checkUsername({'username': username}).then(function(data) {
                    if(data.success) {
                        $scope.validUsername = false;
                        $('.s-username-input').addClass('error');
                        $('.s-username-input').find('i').removeClass().addClass('icon cancel fg-red').show();                        
                        checkAllInputs();
                    } else {
                        $scope.validUsername = true;
                        $('.s-username-input').removeClass('error');
                        $('.s-username-input').find('i').removeClass().addClass('icon check fg-green').show();                        
                        checkAllInputs();
                    }            
                }, function(error) {
                                    
                }).catch(function(e) {
                                    
                }).finally(function() {
                    
                });
            }
        } else {
            if(username == "") {
                $('.s-username-input').removeClass('error');
                $('.s-username-input').find('i').removeClass().hide();
            }
        }
    });

    $(".s-email-input input").bind('input', function () { 
        var email = $.trim($(this).val());
        if(email !== "") {
            if(email.substring(email.length - 4) == '.com') {
                $('.s-email-input').find('i').addClass('icon loading').show();
                AuthenticationService.checkEmail({'email': email}).then(function(data) {
                    if(data.success) {
                        $scope.validEmail = false;
                        $('.s-email-input').addClass('error');
                        $('.s-email-input').find('i').removeClass().addClass('icon cancel fg-red').show();                        
                        checkAllInputs();
                    } else {
                        $scope.validEmail = true;
                        $('.s-email-input').removeClass('error');
                        $('.s-email-input').find('i').removeClass().addClass('icon check fg-green').show();
                        $('.signup-btn').removeAttr('disabled');
                        checkAllInputs();
                    }            
                }, function(error) {
                                    
                }).catch(function(e) {
                                    
                }).finally(function() {
                    
                });
            }            
        }
        else {
            $('.s-email-input').removeClass('error');
            $('.s-email-input').find('i').removeClass().hide();
        }
    });
    
    $('.s-pwd-input input').on('input', function() {
        checkAllInputs();
    });
    $('.s-fname-input input').on('input', function() {
        checkAllInputs();
    });
    $('.s-lname-input input').on('input', function() {
        checkAllInputs();
    });

    function checkAllInputs() {            
        if($.trim($('.s-username-input input').val()) === "" || 
        $.trim($('.s-pwd-input input').val()) === "" ||
        $.trim($('.s-fname-input input').val()) === "" ||
        $.trim($('.s-lname-input input').val()) === "" ||
        $.trim($('.s-email-input input').val()) === "" &&
        !$scope.validUsername || !$scope.validEmail) {
            $('.signup-btn').attr('disabled','disabled');
        } else {
            $('.signup-btn').removeAttr('disabled');
        }
    }
});
