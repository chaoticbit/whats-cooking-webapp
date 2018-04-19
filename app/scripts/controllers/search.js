'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('SearchCtrl', function ($rootScope, $scope, $routeParams, $window, $timeout, SearchService) {    
    if(!$routeParams.key) {
        $scope.searchInput = '';
    } else {
        $scope.searchInput = $routeParams.key;        
    }

    $(".search-dropdown,.search-wrapper").hide();
    $('.global-search').val('');
    $('body').removeClass('noscroll');
    $('.search-input').focus(); 

    $scope.sortValue = 'none';        
    $scope.searchResults = '';
    $scope.filters = {
        'cuisine': '',
        'food_group': '',
        'spiciness': '',
        'calorie_intake': '',
        'cooking_time': ''
    };    

    $('.search-page-cuisine-dropdown').dropdown('refresh'); 

    //CUISINE
    $rootScope.$on("SetCuisineFilter", function(event, data) {
        $scope.filters.cuisine = data;   
        $scope.$apply();     
    });

    $scope.$watchGroup(['filters.cuisine','filters.spiciness','filters.calorie_intake','filters.cooking_time','filters.food_group'], function(newValue, oldValue, scope) {
        // console.log($scope.filters); 
        if($.trim($('.search-input').val()) !== '') {   
            triggerSearchAPI($.trim($('.search-input').val()));    
        }
    });

    $('.ui.radio.checkbox').checkbox({
        onChange: function(val) {
            $scope.sortValue = $('.ui.radio.checkbox.checked > input').val();            
            if($.trim($('.search-input').val()) !== '') {   
                triggerSearchAPI($.trim($('.search-input').val()));    
            }
        }
    });    

    $('.ctime-dropdown').dropdown({
        onChange: function(value) {                        
            setCookingTime($('.c-time-input').val());                                
        }
    });

    var debounce = function (func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
   };   

    function setCookingTime(val) {
        if(val == '') {
            $scope.filters.cooking_time = '';
        } else {
            var time = $('.ctime-dropdown .menu').find('.item.active.selected').data('value');            
            if(time == 'h') {
                val = val * 60;
            }
            $scope.filters.cooking_time = val + 'm';  
        }
        $scope.$apply();
    }
    //COOKING TIME
    $('.c-time-input').on('input', function(e) {
        var val = $.trim($(this).val());                
        
        if(val == '') {
            $scope.filters.cooking_time = '';
        } else {
            var time = $('.ctime-dropdown .menu').find('.item.active.selected').data('value');            
            if(time == 'h') {
                val = val * 60;
            }
            $scope.filters.cooking_time = val + 'm';  
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

    $scope.clearCuisineDropdown = function() {
        $timeout(function(){
            $('.search-page-cuisine-dropdown').dropdown('clear');
        });        
    };

    $('.search-input').on('input', (debounce(function(){
        $(this).val($.trim($(this).val()));
        triggerSearchAPI($(this).val());           
    },500)));

    function triggerSearchAPI(key) {
        var filters = $scope.filters;
        var filterUrl = '';
        var conditions = [];
        var searchApiUrl = '';

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
            searchApiUrl = key + '?' + filterUrl + '?sort_by=' + $scope.sortValue;
        } else {
            searchApiUrl = key + '?sort_by=' + $scope.sortValue;
        }
        
        console.log(searchApiUrl);     
        $('.loader-bg').show();
        SearchService.extendedSearch(searchApiUrl).then(function(data) {
            $scope.searchResults = data.results;
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {
            $('.loader-bg').hide();
        });
    }

});
