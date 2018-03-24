'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('UserCtrl', function ($rootScope, $routeParams, $scope, $window, UserService) {    
    $scope.username = $routeParams.username;
    $scope.userprofile = {};
    $scope.titles = ['gender','email','city','state','country','preferred cuisine','food group','spiciness','calorie intake'];

    if(screen.width > 480) {        
        $(window).on('scroll',function() {
            var distanceScrolled = $(this).scrollTop();
            $('.bg-img').css('-webkit-filter', 'blur('+distanceScrolled/20+'px)');
        });
        
        $(document).on('mouseover', '.top-recipes > ul > li', function(){
           $(this).find('.star').removeClass('transDown').addClass('transUp');
           $(this).find('.upvotecnt').removeClass('transDown').addClass('transUp');
        });
        $(document).on('mouseout', '.top-recipes > ul > li', function(){
           $(this).find('.upvotecnt').removeClass('transUp').addClass('transDown');
           $(this).find('.star').removeClass('transUp').addClass('transDown');
        });
    }

    UserService.getUserProfile({username: $scope.username}).then(function(data) {
        if(data.success) {
            $scope.userprofile = data.results;            
        }                        
    }, function(error) {
                          
    }).catch(function(e) {
                          
    }).finally(function() {
    });
});
