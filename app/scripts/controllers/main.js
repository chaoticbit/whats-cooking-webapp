'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('MainCtrl', function ($scope, $timeout) {	

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

	$('.food-group-dropdown').dropdown({
		useLabels: false
	});	
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

	$scope.toggleNewRecipeBox = function(val) {
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
});
