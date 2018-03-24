'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('SettingsCtrl', function ($rootScope, $scope, $timeout, $window, SettingService) {    

    $scope.profile = {};
    $scope.foodGrpVal = [];        
    $scope.cid = 1;
    var cuisines = $rootScope.listOfCuisines;

    $('.loader-bg').show();
    SettingService.getUserProfile().then(function(data) {
        if(data.success) {
            $scope.profile = data.results;                                    
            var grp = $scope.profile.food_group;            
            if(grp == '100') {
                $scope.foodGrpVal = ['v'];
            } else if(grp == '010') {
                $scope.foodGrpVal = ['n'];
            } else if(grp == '001') {
                $scope.foodGrpVal = ['ve'];
            } else if(grp == '111') {
                $scope.foodGrpVal = ['v','n','ve'];
            } else if(grp == '110') {
                $scope.foodGrpVal = ['v','n'];
            } else if(grp == '101') {
                $scope.foodGrpVal = ['v','ve'];
            }                                               

            $timeout(function() {
                $('.food-group-dropdown').dropdown({                        
                    useLabels: false
                });                     
                var index = -1;
            for(var i = 0; i < cuisines.length; i++) {
                if(cuisines[i].value == $scope.profile.cid) {
                    index = i;
                    break;
                }
            };
            cuisines[index]['selected'] = true;
            console.log(cuisines);
            
            $('.modal-cuisine-dropdown').dropdown({
                values: cuisines,       
                placeholder: 'Cuisines',
                onChange: function(value) {
                    $scope.profile.cid = value;                    
                }
            });                                 
            }, 500);      
        }                        
    }, function(error) {
                          
    }).catch(function(e) {
                          
    }).finally(function() {
        $('.loader-bg').hide();
    });
    

    $('.male-gender-btn').on('click', function() {
        $scope.profile.gender = 'male';
        $(this).attr('data-selected', true);
        $('.female-gender-btn').removeClass('female-gender-selected');
        $(this).addClass('male-gender-selected');
        $('.female-gender-btn').attr('data-selected', false);        
    });
    $('.female-gender-btn').on('click', function() {   
        $scope.profile.gender = 'female';
        $(this).attr('data-selected', true);
        $('.male-gender-btn').removeClass('male-gender-selected');
        $(this).addClass('female-gender-selected');
        $('.male-gender-btn').attr('data-selected', false);
    });    
});
