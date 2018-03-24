'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('UserCtrl', function ($rootScope, $routeParams, $scope, $window) {    
    $scope.username = $routeParams.username;

    if(screen.width > 480) {
        $(window).on('scroll',function() {
            var distanceScrolled = $(this).scrollTop();
            $('.bg-img').css('-webkit-filter', 'blur('+distanceScrolled/20+'px)');
        });
        
        $('.top-recipes > ul > li').hover(function(){
           $(this).find('.star').removeClass('transDown').addClass('transUp');
           $(this).find('.upvotecnt').removeClass('transDown').addClass('transUp');
        },function(){
           $(this).find('.upvotecnt').removeClass('transUp').addClass('transDown');
           $(this).find('.star').removeClass('transUp').addClass('transDown');
        });
    }
});
