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
    $scope.filters = {
        'cuisine': '',
        'food_group': '',
        'spiciness': '',
        'calorie_intake': '',
        'cooking_time': ''
    };    

    //CUISINE
    $rootScope.$on("SetCuisineFilter", function(event, data) {
        $scope.filters.cuisine = data;   
        $scope.$apply();     
    });

    $scope.$watchGroup(['filters.cuisine','filters.spiciness','filters.calorie_intake','filters.cooking_time','filters.food_group'], function(newValue, oldValue, scope) {
        // console.log($scope.filters);    
        triggerSearchAPI();    
    });

    $('.ui.radio.checkbox').checkbox({
        onChange: function(val) {
            $scope.sortValue = $('.ui.radio.checkbox.checked > input').val();            
        }
    });    

    $('.ctime-dropdown').dropdown({
        onChange: function() {
            var val = $.trim($('.c-time-input').val());
            if(val !== '') {
                setCookingTime(val);
            }                    
        }
    });

    function setCookingTime(val) {
        if(val == '') {
            $scope.filters.cooking_time = '';
        } else {
            var time = $('.ctime-dropdown').find('.text').text();            
            $scope.filters.cooking_time = val + ' ' + time;  
        }
        $scope.$apply();
    }
    //COOKING TIME
    $('.c-time-input').on('input', function(e) {
        var val = $.trim($(this).val());                
        
        if(val == '') {
            $scope.filters.cooking_time = '';
        } else {
            var time = $('.ctime-dropdown').find('.text').text();            
            $scope.filters.cooking_time = val + ' ' + time;  
        }        
        $scope.$apply();
    });

    $('.food-group-checkbox').checkbox({
        onChange: function() {
            var elem = $('.food-group-checkbox.checked');
            var temp = [];            
            _.forEach(elem, function(value, key) {
                temp.push($(value).find('input').val());
            });            
            computeFoodGroupValue(temp);            
        }
    });    
    
    //FOOD_GROUP
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
            else {
                computed = '';
            }
		} else if (foodGroup.length == 3) {
			computed = '111';
        } else {
            computed = '';
        }
        $scope.filters.food_group = computed;
        $scope.$apply();
    }

    function triggerSearchAPI() {
        var filters = $scope.filters;
        var filterUrl = '';
        var conditions = [];

        if(filters.food_group !== '') {
            conditions.push("fg=" + filters.food_group);
        }
        if(filters.spiciness !== '') {
            conditions.push("s=" + filters.spiciness);
        }
        if(filters.cuisine !== '') {
            conditions.push("cid=" + filters.cuisine);
        }
        if(filters.calorie_intake !== '') {
            conditions.push("cal=" + filters.calorie_intake);
        }
        if(filters.cooking_time !== '') {
            conditions.push("ct=" + filters.cooking_time);
        }
        
        if(conditions.length > 0) {
            filterUrl = conditions.join('&');
        }
        console.log(filterUrl);        
    }

});
