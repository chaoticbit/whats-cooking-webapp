'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('SearchCtrl', function ($rootScope, $scope, $window, $timeout, SearchService) {
    $scope.sortValue = '';    
    $scope.searchInput = '';
    $scope.filters = {};
    
    $('.ui.radio.checkbox').checkbox({
        onChange: function(val) {
            $scope.sortValue = $('.ui.radio.checkbox.checked > input').val();            
        }
    });    

    $('.food-group-checkbox').checkbox({
        onChange: function() {
            var elem = $('.food-group-checkbox.checked');
            var temp = [];            
            _.forEach(elem, function(value, key) {
                temp.push($(value).find('input').val());
            });            
            computeFoodGroupValue(temp);
            console.log($scope.filters);
        }
    });    
    
    function computeFoodGroupValue(foodGroup) {
        var computed;
        if(foodGroup.length == 1) {			
			if (foodGroup[0] == 'v') {
				computed = '100';
			} else if (foodGroup[0] == 'n') {
				computed = '010';
			} else if (foodGroup[0] == 've') {
				computed = '001';
			}
		} else if(foodGroup.length == 2) {
			if (foodGroup[0] == 'v' && foodGroup[1] == 'n') {
				computed = '110';
			} else if (foodGroup[0] == 'v' && foodGroup[1] == 've') {
				computed = '101';
			} 
		} else if (foodGroup.length == 3) {
			computed = '111';
        }
        $scope.filters.food_group = computed;
    }

});
