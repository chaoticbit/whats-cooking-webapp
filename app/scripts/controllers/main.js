'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('MainCtrl', function ($rootScope, $scope, $cookies, $http, $timeout, SettingService, UtilService, localStorageService) {	
    
    $rootScope.userProfile = localStorageService.get('userProfile');

    if($cookies.get('new-access')) {
        $('.user-profile-signup-modal').modal({
            closable: false, 
            onApprove: function () {
                return false
            }
          }).modal('show');      
        $cookies.remove('new-access');  
    }

    $('body').attr('ondragstart', 'return false');
    $('body').attr('draggable', 'false');
    $('body').attr('ondragenter', 'event.dataTransfer.dropEffect=\'none\'; event.stopPropagation(); event.preventDefault();');
    $('body').attr('ondragenter', '');
    $('body').attr('ondragover', 'event.dataTransfer.dropEffect=\'none\';event.stopPropagation(); event.preventDefault();');
    $('body').attr('ondrop', 'event.dataTransfer.dropEffect=\'none\';event.stopPropagation(); event.preventDefault();');

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
    
    $scope.listOfCuisines = [];
    UtilService.getCuisines().then(function(data) {
        if(data.success) {
            _.forEach(data.results, function(value, key) {
                $scope.listOfCuisines.push({
                    'name': value.name,
                    'value': value.srno
                });
            });            
            $('.modal-cuisine-dropdown').dropdown({
                values: $scope.listOfCuisines,        
                placeholder: 'Cuisines',
                onChange: function(value) {
                    $scope.signUpModalProfile.pref_cuisine = value;
                }
            });
        }
    }, function(error) {
                          
    }).catch(function(e) {
                          
    }).finally(function() {
    }); 

	$scope.selectedCuisine = '';
	$scope.cookingTime = '';
    $scope.spiciness = 1;	
    $scope.signUpModalProfile = {};
    $scope.signUpModalProfile.spiciness = 1;
    $scope.modalFoodGrpVal = [];
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

    /**
     * 
     * DROPDOWNS
     * 
     */
    
    // $('.search-filter-dropdown').dropdown({
    //     action: 'combo',        
    // });

    // $('.search-filter-dropdown').on('click', '.item', function() {
    //     toggleIngredientSearch();
    // });
     
	$('.headbar-user-dropdown').dropdown();
    
	$('.user-action-dropdown').dropdown();
	$('.food-group-dropdown, .modal-food-group-dropdown').dropdown({
		useLabels: false
    });	
    $('.ing-search-dropdown').dropdown();
	$('.cuisine-dropdown').dropdown({		
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
        return computed;
    }

	$('.post-recipe-btn').click(function() {
		$scope.recipeFoodGroup = -1;
        
        $scope.recipeFoodGroup = computeFoodGroupValue($scope.foodGrpVal);

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
            $('body').removeClass('noscroll');
        }        
    });

    $('.global-search').on('click', function () {
        $('.search-wrapper, .search-dropdown').show();        
        $('body').addClass('noscroll');
    });

    $('.global-search').bind('keydown', function(e) {
        var key = e.keyCode;
        if (key === 27) {
            $(".search-dropdown,.search-wrapper").hide();
            $(this).val('');
            $('body').removeClass('noscroll');
        }
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
                    if(cnt == 3) {
                        $('.ing-search-input').attr('placeholder','Press Enter to search');                             
                    }
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
            if($('.ing-search-hdn-input').attr('data-cnt') == 3) {
                processIngredientSearch();
            }                  
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

    $(document).on('click touchstart','.toggle-search-btn',function() {
        if($('.global-search-div').css('display') != 'none') {
            $('.global-search-div').hide();
            $('.ingredient-search-filter').show();   
            $('.ing-search-input').focus();
        } else {
            $('.ingredient-search-filter').hide();   
            $('.global-search-div').show();
            $('.global-search').focus();
        }
    });

    function processIngredientSearch() {
        alert($('.ing-search-hdn-input').val());
    }

    $('.male-gender-btn').on('click', function() {
        $scope.signUpModalProfile.gender = 'male';
        $(this).attr('data-selected', true);
        $('.female-gender-btn').removeClass('female-gender-selected');
        $(this).addClass('male-gender-selected');
        $('.female-gender-btn').attr('data-selected', false);        
    });
    $('.female-gender-btn').on('click', function() {   
            $scope.signUpModalProfile.gender = 'female';
            $(this).attr('data-selected', true);
            $('.male-gender-btn').removeClass('male-gender-selected');
            $(this).addClass('female-gender-selected');
            $('.male-gender-btn').attr('data-selected', false);
    
    });    

    $scope.validateModalSignUpForm = function() {        
        if($('.modal-cuisine-dropdown .text').html() == 'Cuisines' || !$scope.modalFoodGrpVal || $scope.modalFoodGrpVal.length == 0) {
            return true;
        } else {
            return false;
        }
    };

    $scope.saveSignupUserProfile = function(signUpModalProfile) {
        $scope.signUpModalProfile.food_group = computeFoodGroupValue($scope.modalFoodGrpVal);        
        signUpModalProfile.profile_imagepath = '';
        $('.save-signup-profile-btn').addClass('icon loading');
        SettingService.saveUserProfile(signUpModalProfile).then(function(data) {
            if(data.success) {
                $('.user-profile-signup-modal').modal('hide');
                $('.status-msg-modal').modal('show', function() {
                    onVisible: setTimeout(function() {
                        $('.status-msg-modal').modal('hide');
                    }, 1500)
                });
            }                  
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {

        });                
    };    

    if (screen.width < 480 || screen.width < 800) {
        var h = screen.height;
        $('.sidebar .pure-u-3-4').css('height', h + 'px');
        $('.toggle-sidebar').on('click', function () {
            if ($(this).attr('aria-expanded') === 'false') {
                $('.sidebarwrapper').fadeIn(function () {
                    $('.toggle-sidebar').addClass('active');
                    $('.bubble-mobile').hide();                        
                    $('.sidebar').animate({left: '0%'}, function () {                        
                        $('.toggle-sidebar').attr('aria-expanded', 'true');
                        $('body').addClass('noscroll');
                        document.ontouchmove = function (event) {
                            event.preventDefault();
                        };
                    });
                });
            }
            else {
                $('.toggle-sidebar').removeClass('active');
                $('.sidebar').animate({left: '-100%'}, function () {
                    $('.bubble-mobile').show();
                    $('.toggle-sidebar').attr('aria-expanded', 'false');
                    $('.sidebarwrapper').hide();
                    $('body').removeClass('noscroll');
                    document.ontouchmove = function (event) {
                        event.preventDefault();
                    };
                });
            }
        });        
    }    
});
