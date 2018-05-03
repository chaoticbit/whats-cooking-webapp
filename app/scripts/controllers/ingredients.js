'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:IngredientsCtrl
 * @description
 * # IngredientsCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('IngredientsCtrl', function ($rootScope, $location, $scope, $window, $timeout, $routeParams, SearchService, $sce) {
    $scope.searchResults = '';
    
    if($routeParams.keyword) {
        $scope.searchKeyword = $routeParams.keyword;
        $scope.ings = $routeParams.ing;    
        var routeIngredientsArray = $scope.ings.split(',');    
        for(var i = 0; i < routeIngredientsArray.length; i++) {
            addtags(routeIngredientsArray[i]);
            processIngredientSearch();
        }
    } else {
        $scope.searchKeyword = '';
        $scope.ings = $routeParams.ing;    
        $('.ing-search-hdn-input').val($scope.ings);
        var routeIngredientsArray = $scope.ings.split(',');    
        $('.ing-search-hdn-input').attr('data-cnt',routeIngredientsArray.length);
        for(var i = 0; i < routeIngredientsArray.length; i++) {            
            $('<a href="#" class="tag" style="float: left;transform: translate(7%,11%);" id="tag-' + routeIngredientsArray[i] + '">' + routeIngredientsArray[i] + '</a>').insertBefore($('.ing-search-input'));            
            // addtags(routeIngredientsArray[i]);
            processIngredientSearch();            
        }
    }    
    
    function strip(html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText;
    }

    function processIngredientSearch() {
        var payload = {
            'keyword': $scope.searchKeyword || '',
            'ingredients': $('.ing-search-hdn-input').val()
        };                
        
        window.location.replace('http://0.0.0.0:9000/#!/ingredients/search/' + $('.ing-search-hdn-input').val());                
        
        $('.loader-bg').show();
        SearchService.ingredientSearch(payload).then(function(data) {
            $scope.searchResults = data.results;                                       
            for(var i = 0; i < $scope.searchResults.length; i++) {
                var listItems = $scope.searchResults[i].ingredients_html.match(/<l(.)>.*?<\/l\i>/g);
                var onlyIngredients = $scope.searchResults[i].ingredients.split(",");                
                
                for(var j = 0; j < listItems.length; j++) {
                    var innerContent = strip(listItems[j]).trim();      
                    for(var k = 0; k < routeIngredientsArray.length; k++) {          
                        if(onlyIngredients[j].match(routeIngredientsArray[k])) {                        
                            var innerContentWithLink = '<a href="https://www.amazon.com/s/ref=sr_1_2?url=search-alias%3Damazonfresh&field-keywords=' + onlyIngredients[j] + '" target="_blank" style="background: cornsilk;">' + innerContent + '</a>';                
                        } else {
                            var innerContentWithLink = '<a href="https://www.amazon.com/s/ref=sr_1_2?url=search-alias%3Damazonfresh&field-keywords=' + onlyIngredients[j] + '" target="_blank">' + innerContent + '</a>';                
                        }
                    }
                    listItems[j] = '<li>' + innerContentWithLink + '</li>';
                }
                var finalList = listItems.join("");
                finalList = '<ol>' + finalList + '</ol>';
                $scope.searchResults[i].safeIngredients = $sce.trustAsHtml(finalList);                        
            }                        
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {
            $('.loader-bg').hide();
        });
    }

    function makeAPICall() {

    }

    $('.search-ing-btn').on('click', function() {
        processIngredientSearch();
    });

    function regex_escape(str) {
        return str.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:;\\-\']', 'g'), '\\$&');
    }

    function addtags(tag){
        var value = $('.ing-search-hdn-input').val();
        var cnt = $('.ing-search-hdn-input').attr('data-cnt');        
        if (cnt !== '3') {
            if (value !== "") {
                var array = $('.ing-search-hdn-input').val().split(",");
                if ($.inArray(tag, array) === -1) {
                    $('<a href="#" class="tag" style="float: left;transform: translate(7%,11%);" id="tag-' + tag + '">' + tag + '</a>').insertBefore($('.ing-search-input'));
                    $('.ing-search-hdn-input').attr('data-cnt', cnt);
                    $('.ing-search-hdn-input').val(value + ',' + tag);
                    $('.ing-search-input').focus();
                    $('.ing-search-input').val('');
                    cnt++;
                    $('.ing-search-hdn-input').attr('data-cnt', cnt);                    
                    if(cnt == 3) {
                        $('.ing-search-input').attr('placeholder','Press Enter to search');                             
                    }
                }
                else {
                    //
                }
            }
            else {
                $('<a href="#" class="tag" style="float: left;transform: translate(7%,11%);" id="tag-' + tag + '">' + tag + '</a>').insertBefore($('.ing-search-input'));
                $('.ing-search-hdn-input').val(tag);
                $('.ing-search-input').focus();
                $('.ing-search-input').val('');
                cnt++;
                $('.ing-search-hdn-input').attr('data-cnt', cnt);                
                if(cnt == 3) {
                    $('.ing-search-input').attr('placeholder','Press Enter to search');                         
                }
            }            
        }
        else{            
            $('.ing-search-input').val('');                   
        }
    }

    $('.ing-search-input').bind('keydown', function (e) { 
        var key = e.keyCode;        
        if (key === 13) {  
            // if($('.ing-search-hdn-input').attr('data-cnt') == 3) {
                processIngredientSearch();
            // }         
        }
        if(key === 9) {         
            if ($(this).val() !== "") {
                addtags($(this).val());                
            }
            return false;
        }
        else if (key === 8 && $(this).val() === "") {
            if($('.ing-search-hdn-input').val() == '') {
                $('.ing-search-hdn-input').attr('data-cnt','0');
                return false;
            } 
            var array = $('.ing-search-hdn-input').val().split(",");
            var cnt = $('.ing-search-hdn-input').attr('data-cnt');
            var newstr = "";
            $('.ing-search-input').parent().find('#tag-' + regex_escape(array[array.length - 1])).remove();
            for (var i = 0; i < array.length - 1; i++) {
                if (i === 0) {
                    newstr = newstr + array[i];
                }
                else {
                    newstr = newstr + "," + array[i];
                }
            }
            cnt--;
            $('.ing-search-hdn-input').attr('data-cnt', cnt);
            $('.ing-search-hdn-input').val(newstr);   
            $('.ing-search-input').attr('placeholder','max(3)');                          
            return false;
        }        
        if (key === 27) {
            $(".search-dropdown,.search-wrapper").hide();
            $(this).val('');
            $('body').removeClass('noscroll');
        }
    });      
});
