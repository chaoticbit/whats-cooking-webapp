'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('SettingsCtrl', function ($rootScope, $scope, $window, SettingService) {    

    $('.food-group-dropdown, .modal-food-group-dropdown').dropdown({
		useLabels: false
    });	

    $('.male-gender-btn').on('click', function() {
        // $scope.signUpModalProfile.gender = 'male';
        $(this).attr('data-selected', true);
        $('.female-gender-btn').removeClass('female-gender-selected');
        $(this).addClass('male-gender-selected');
        $('.female-gender-btn').attr('data-selected', false);        
    });
    $('.female-gender-btn').on('click', function() {   
            // $scope.signUpModalProfile.gender = 'female';
            $(this).attr('data-selected', true);
            $('.male-gender-btn').removeClass('male-gender-selected');
            $(this).addClass('female-gender-selected');
            $('.male-gender-btn').attr('data-selected', false);
    
    });    
});
