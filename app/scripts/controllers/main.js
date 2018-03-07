'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('MainCtrl', function ($rootScope, $scope, $http, $timeout) {	

	var editor = new MediumEditor('.editable', {
		imageDragging: false,
        fileDragging: false,
        sticky:true,
        autoLink:false,
		toolbar: {			
			allowMultiParagraphSelection: true,
			buttons: ['bold', 'italic', 'underline', 'h2', 'h3', 'orderedlist'],
			diffLeft: 0,
			diffTop: -10,
			firstButtonClass: 'medium-editor-button-first',
			lastButtonClass: 'medium-editor-button-last',
			relativeContainer: null,
			standardizeSelectionStart: false,
			static: false,			
		}
	});

	$scope.number = 10;
	$scope.getNumber = function(num) {
    	return new Array(num);   
	}

	$http.get('http://localhost/soapbox-api/Ajax_Controller/search_tags/').then(function(res) {
		$scope.tags = res.results;		
	});

	$scope.selectedCuisine = '';
	$scope.cookingTime = '';
	$scope.spiciness = 1;	
	$scope.listOfIngredients = [{
		qty: '4 pieces',
		name: 'Ginger',
		notes: 'chopped'
	}];              

	$scope.addItem = function() {
		$scope.listOfIngredients.push({
			qty: '',
			name: '',
			notes: ''
		});		                  		
		$timeout(function () {
			$('#input-qty' + ($scope.listOfIngredients.length - 1)).focus();
		});
		if($scope.listOfIngredients.length == 2) 
			$('.editable').css('height',$('.editable').height() - 40 + 'px');
		else if ($scope.listOfIngredients.length == 3)
			$('.editable').css('height',$('.editable').height() - 40 + 'px');
	};

	$scope.removeItem = function(index) {
		if($scope.listOfIngredients.length == 2) 
			$('.editable').css('height',$('.editable').height() + 64);
		else if ($scope.listOfIngredients.length == 3)
			$('.editable').css('height',$('.editable').height() + 64);
		$scope.listOfIngredients.splice(index, 1);		
	};

	$("[contenteditable]").focusout(function(){
        var element = $(this);        
        if (!element.text().trim().length) {
            element.empty();
        }
	});

	
	$('.headbar-user-dropdown').dropdown({
		action: 'hide'
	});
	$('.user-action-dropdown').dropdown();
	$('.food-group-dropdown').dropdown({
		useLabels: false
    });	
    $('.ing-search-dropdown').dropdown();
	$('.cuisine-dropdown').dropdown({
		values: [
			{ name: 'Italian'},
			{ name: 'Mediterrian'},
			{ name: 'Indian'},
			{ name: 'American'},
			{ name: 'French'}
		],
		placeholder: 'Cuisines'
	});	
	$('.tags-dropdown').dropdown({		
		allowAdditions: true,
		action: 'combo',
		minCharacters: 1,
		apiSettings: {
			url: 'http://localhost/soapbox-api/Ajax_Controller/search_tags/{query}'
		},		
		filterRemoteData: false,
		saveRemoteData:false,
		maxSelections: 5
	});	
	$('.post-recipe-btn').click(function() {
		$scope.recipeFoodGroup = -1;
		if($scope.foodGrpVal.length == 1) {			
			if ($scope.foodGrpVal[0] == 'v') {
				$scope.recipeFoodGroup = '100';
			} else if ($scope.foodGrpVal[0] == 'n') {
				$scope.recipeFoodGroup = '010';
			} else if ($scope.foodGrpVal[0] == 've') {
				$scope.recipeFoodGroup = '001';
			}
		} else if($scope.foodGrpVal.length == 2) {
			if ($scope.foodGrpVal[0] == 'v' && $scope.foodGrpVal[1] == 'n') {
				$scope.recipeFoodGroup = '110';
			} else if ($scope.foodGrpVal[0] == 'v' && $scope.foodGrpVal[1] == 've') {
				$scope.recipeFoodGroup = '101';
			} 
		} else if ($scope.foodGrpVal.length == 3) {
			$scope.recipeFoodGroup = '111';
		}

		var cleanIngredientsList = [];
		var listTag = '<ol>';
		for(var i = 0; i < $scope.listOfIngredients.length; i++) {
			cleanIngredientsList[i] = $scope.listOfIngredients[i].name;					
			listTag += '<li>' + $scope.listOfIngredients[i].qty + ' ' + $scope.listOfIngredients[i].name + ' ' + $scope.listOfIngredients[i].notes + '</li>';		 
		}
		listTag += '</ol>';
		console.log('Title ' + $scope.title);
		console.log('Clean ing list ' + cleanIngredientsList);
		console.log(listTag);		
		console.log($('.editable').html());
		console.log('Cuisine ' + $('.cuisine-dropdown .text').html());		
		console.log('Food group ' + $scope.recipeFoodGroup);
		console.log('Spiciness ' + $scope.spiciness);
		console.log('Prep time ' + $scope.prepTime);
		console.log('Cooking time ' + $scope.cookingTime);
		console.log('Calorie count ' + $scope.calorieCount);
		console.log('Servings ' + $scope.noOfServings);
		console.log($('.tags-hdn-input').val());
		console.log('Description ' + $scope.recipeDescription);
	});

	$rootScope.toggleNewRecipeBox = function(val) {
		if(val == 1) { //SlideDown
			$('body').addClass('noscroll');
			$('.new-recipe-box').slideDown(function() {					
				$('.feed-box').css('margin-top', '10px');				
				$('.toggle-recipe-box-btn').hide();		
			});			
		} else { //SlideUp
			$('.new-recipe-box').slideUp(function() {
				$('.feed-box').css('margin-top', '70px');
				$('body').removeClass('noscroll');			
				$('.toggle-recipe-box-btn').show();
			});			
		}
    }
    
    $(document).on('mouseup touchstart', function (e) {
        var search_container = $(".search-dropdown");
        if (!search_container.is(e.target) && search_container.has(e.target).length === 0)
        {
            search_container.hide();
            $(".search-wrapper").hide();
            $('body').removeClass('offscroll');
        }        
    });

    $('.global-search').on('click', function () {
        $('.search-wrapper, .search-dropdown').show();        
        $('body').addClass('offscroll');
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
                    $('<a href="#" class="tag" style="float: left;transform: translate(7%,11%);" id="tag-' + tag.replace(/[^a-zA-Z0-9]/g, "") + '">' + tag.replace(/[^a-zA-Z0-9]/g, "") + '</a>').insertBefore($('.ing-search-input'));
                    $('.ing-search-hdn-input').attr('data-cnt', cnt);
                    $('.ing-search-hdn-input').val(value + ',' + tag.replace(/[^a-zA-Z0-9]/g, ""));
                    $('.ing-search-input').focus();
                    $('.ing-search-input').val('');
                    cnt++;
                    $('.ing-search-hdn-input').attr('data-cnt', cnt);
                    var p = 3 - cnt;                                      
                    $('.ing-search-input').attr('placeholder','add ingredients(' + p + ')');
                    // if(cnt == 3) {
                    //     $('.ing-search-input').blur();
                    // }
                }
                else {
                    //
                }
            }
            else {
                $('<a href="#" class="tag" style="float: left;transform: translate(7%,11%);" id="tag-' + tag.replace(/[^a-zA-Z0-9]/g, "") + '">' + tag.replace(/[^a-zA-Z0-9]/g, "") + '</a>').insertBefore($('.ing-search-input'));
                $('.ing-search-hdn-input').val(tag.replace(/[^a-zA-Z0-9]/g, ""));
                $('.ing-search-input').focus();
                $('.ing-search-input').val('');
                cnt++;
                $('.ing-search-hdn-input').attr('data-cnt', cnt);
                var p = 3 - cnt;                                      
                    $('.ing-search-input').attr('placeholder','add ingredients(' + p + ')');
                // if(cnt == 3) {
                //     $('.ing-search-input').blur();
                // }
            }            
        }
        else{            
            $('.ing-search-input').val('');            
        }
    }

    $('.ing-search-input').bind('keydown', function (e) { 
        var key = e.keyCode;        
        if (key === 13) {            
            if ($(this).val() !== "") {
                addtags($(this).val());                
            }
            return false;
        }
        else if (key === 8 && $(this).val() === "") {
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
            var p;
            if(cnt == 2) 
                p = 1;
            else if(cnt == 1) 
                p = 2;
            else if(cnt == 0)
                p = 3;
            $('.ing-search-input').attr('placeholder','add ingredients(' + p + ')');
            return false;
        }
    });
});
