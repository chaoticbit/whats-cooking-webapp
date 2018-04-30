'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('MainCtrl', function ($rootScope, $scope, $location,$window, $cookies, $http, $timeout, ApiConfig, SettingService, RecipeService, SearchService, UtilService, localStorageService, Upload) {	
    
    if($cookies.get('new-access')) {
        $('.user-profile-signup-modal').modal({
            closable: false, 
            onApprove: function () {                
                return false                
            }
          }).modal('show');              
    }        

    $('body').attr('ondragstart', 'return false');
    $('body').attr('draggable', 'false');
    $('body').attr('ondragenter', 'event.dataTransfer.dropEffect=\'none\'; event.stopPropagation(); event.preventDefault();');
    $('body').attr('ondragenter', '');
    $('body').attr('ondragover', 'event.dataTransfer.dropEffect=\'none\';event.stopPropagation(); event.preventDefault();');
    $('body').attr('ondrop', 'event.dataTransfer.dropEffect=\'none\';event.stopPropagation(); event.preventDefault();');    

    // $(window).on('scroll', function(){
    //     if ($(this).scrollTop() > 200) {
    //         $('.ingredient-search-box').addClass('fixed pure-u-md-3-4');            
    //     } else {
    //         $('.ingredient-search-box').removeClass('fixed pure-u-md-3-4');            
    //     }
    // });

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
        
    $scope.imagesAccepted = 6;
    $scope.imagesUploaded = 0;
    $scope.number = 10;
    $scope.morePages = false;

    $rootScope.quickSearchResults = '';
    $scope.localFavourites = [];
    $scope.autocompleteIngList = [];
    $scope.recipes = [];
    $scope.recipeCoverImage = '';
    $rootScope.favourites = [];
    $scope.featuredRecipes = [];
	$scope.selectedCuisine = '';
	$scope.cookingTime = '';
    $scope.spiciness = 1;	
    $scope.signUpModalProfile = {};
    $scope.signUpModalProfile.spiciness = 1;
    $scope.modalFoodGrpVal = [];
    $scope.lastTimestamp = '';
    $scope.ingSearchKeyword = '';

	$scope.listOfIngredients = [{
		qty: '',
		name: '',
		notes: ''
    }];               

	$scope.getNumber = function(num) {
    	return new Array(num);   
	}

    $rootScope.$on("CallRecipes", function() {
        getRecipes();
    });

    $scope.$on('StoreFavourites', function(event, data) {
        $scope.localFavourites = data;
    });

    function getTags () {
        UtilService.getTags().then(function(data) {
            if(data.success) {
                $scope.tags = data.results;
            }                        
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {
        });
    }

    
    
    function getRecipes() {
        // $('.ui.dimmer').dimmer('show');
        $('.loader-bg').show();
        RecipeService.getRecipes().then(function(data) {
            if(data.success) {
                $scope.recipes = data.results;  
                $scope.lastTimestamp = $scope.recipes[$scope.recipes.length - 1].timestamp;                     
                $scope.morePages = true;
            }                        
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {
            // $('.ui.dimmer').dimmer('hide');
            $('.loader-bg').hide();
        });
    }    

    function loadMoreRecipes() {
        $('.load-more > a').find('.ui.loader').addClass('active');
        $('.load-more > a').find('span').hide();        
        // $('.loader-bg').show();
        RecipeService.loadMoreRecipes({'last_ts': $scope.lastTimestamp}).then(function(data) {
            if(data.results.length > 0) {
                for(var i = 0,j = $scope.recipes.length; i < data.results.length; i++,j++) {
                    $scope.recipes[j] = data.results[i];
                }                                                   
                $scope.lastTimestamp = $scope.recipes[$scope.recipes.length - 1].timestamp;       
                console.log($scope.lastTimestamp);
            } else {
                $scope.morePages = false;
            }                        
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {
            $('.load-more > a').find('.ui.loader').removeClass('active');
            $('.load-more > a').find('span').show();
            // $('.loader-bg').hide();
        });
    }

    $(document).on('click','.load-more', function() {
        loadMoreRecipes();
    });
     

    function getFeaturedRecipes() {
        UtilService.getFeaturedRecipes().then(function(data) {
            if(data.success) {
                $scope.featuredRecipes = data.results;                
            }                        
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {
        });
    }    

    (function() {        
        getRecipes();
        getTags();        
        getFeaturedRecipes();
    })();

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

    $scope.addCuisine = function(cid, $event) {        
        var elem = $event.currentTarget;          
        var input = $('.selected-cuisines');
        if ($(elem).hasClass('selected')) { 
            var val = cid;
            var array = input.val().split(",");
            var newstr = "";
            for (var i = 0; i < array.length; i++) {
                if(array[i]===val)
                    continue;
                if (newstr==="") {
                    newstr = newstr + array[i];
                }
                else {
                    newstr = newstr + "," + array[i];
                }
            }
            input.val(newstr);
            $(elem).find('.defocus-panel').fadeOut(100);
            $(elem).removeClass('selected');
        } else {
            var value = input.val();
            if (value !== "") {
                var array = input.val().split(",");
                if ($.inArray(cid, array) === -1) {
                    input.val(input.val() + ',' + cid);
                }
            }
            else {
                input.val(cid);
            }
            $(elem).find('.defocus-panel').fadeIn(100);
            $(elem).addClass('selected');
        }
        console.log(input.val());        
    };      
         
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

    $('.ui.rating').rating('disable');

    $('.recipe-card-rating').rating('disable');     	
	$('.food-group-dropdown, .modal-food-group-dropdown').dropdown({
		useLabels: false
    });	
    $('.ing-search-dropdown').dropdown();	

	$('.tags-dropdown').dropdown({		
		allowAdditions: true,
		action: 'combo',
		minCharacters: 1,
		apiSettings: {
            url: ApiConfig.API_URL + '/Util/getTagsByKey/{query}',
            headers: {'x-api-key': btoa(ApiConfig.API_KEY),'Authorization': $rootScope.userProfile.token}
		},		
		filterRemoteData: false,
		saveRemoteData:false,
		maxSelections: 5
    });	    

    // $(document).on('mouseenter mouseover', '.recipe-item', function(e) {        
    //     $(this).find('.recipe-card-menu').fadeOut(100, function() {
    //         $(this).closest('.recipe-item').find('.recipe-card-hover-menu').fadeIn(300);
    //     });
    // });

    // $(document).on('mouseleave mouseout', '.recipe-item', function() {
    //     $(this).find('.recipe-card-hover-menu').fadeOut(100, function() {
    //         $(this).closest('.recipe-item').find('.recipe-card-menu').fadeIn(300);
    //     });
    // });

    $scope.triggerIngredientSearch = function() {             
        $location.path('/ingredients/search/' + $('.ing-search-hdn-input').val());
    };

    $scope.upvoteRecipe = function(recipe_id, $event) {
        var elem = $event.currentTarget;
        var index = -1;

        RecipeService.upvote({rid: recipe_id}).then(function(data) {
            if(data.success) {                
                for(var i = 0; i < $scope.recipes.length; i++) {
                    if($scope.recipes[i].recipe_id == recipe_id) {
                        index = i;
                        break;
                    }
                }
                $scope.recipes[index].upvotes = data.results.upvote_cnt;
                if($(elem).hasClass('upvoted')) { //remove upvote
                    $(elem).removeClass('upvoted');            
                    $scope.recipes[index].isUpvoted = false;
                } else { //add upvote
                    $scope.recipes[index].isUpvoted = true;                            
                }                     
            }                                
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {
        });        
    };    

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

    $(document).on('click', '.uploaded-image-card', function() {
        $('.uploaded-image-list').find('.black.card').removeClass('selected-as-cover');              
        $(this).closest('.black.card').addClass('selected-as-cover');              
        var img = $(this).data('name');
        $scope.recipeCoverImage = img;              
    });

	$('.post-recipe-btn').click(function() {
        $scope.recipeFoodGroup = -1;        
        $scope.selectedCuisine = $('.cuisine-dropdown .menu').find('.item.active.selected').data('value');
        
        $scope.recipeFoodGroup = computeFoodGroupValue($scope.foodGrpVal);

		var cleanIngredientsList = [];
		var listTag = '<ol>';
		for(var i = 0; i < $scope.listOfIngredients.length; i++) {
			cleanIngredientsList[i] = ($scope.listOfIngredients[i].name).toLowerCase();					
			listTag += '<li>' + $scope.listOfIngredients[i].qty + ' ' + $scope.listOfIngredients[i].name + ' ' + $scope.listOfIngredients[i].notes + '</li>';		 
		}
        listTag += '</ol>';
        var gallery = [];	
        _.forEach($scope.uploadedFilesList, function(value, key) {
            gallery[key] = $scope.uploadedFilesList[key].split('/')[2];
        });
        var uploadedImages = gallery.join(',');
        var ingredients = cleanIngredientsList.join(',');
        var newRecipeObject = {
            'title': $scope.title,
            'ingredients': ingredients,
            'html_ingredients_list': listTag,
            'preparation': $('.editable').html(),
            'cover_imagepath': $scope.recipeCoverImage,
            'cuisine': $scope.selectedCuisine,
            'food_group': $scope.recipeFoodGroup,
            'spiciness': $scope.spiciness,
            'prep_time': $scope.prepTime,
            'cooking_time': $scope.cookingTime,
            'calorie_intake': $scope.calorieCount,
            'no_of_servings': $scope.noOfServings,
            'tags_array': $('.tags-hdn-input').val(),
            'description': $scope.recipeDescription,
            'uploaded_images': uploadedImages,
            'uploaded_video': $scope.uploadedVideo.split('/')[2] || ''
        };                

        RecipeService.postNewRecipe(newRecipeObject).then(function(data) {
            if(data.success) {
                console.log(data.results);                
                $scope.recipes.unshift(data.results);
                // $scope.recipes.push(data.results);
                $('.new-recipe-box').slideUp(function() {
                    $('.feed-box').css('margin-top', '50px');
                    $('body').removeClass('noscroll');			                    
                });		
            }                            
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {

        });
    });
    
    $scope.uploadedFilesList = [];
    $scope.uploadedVideo = '';
    
    $scope.uploadVideo = function(file) {
        console.log('in upload video');
        
        if($scope.uploadedVideo == '') {
            if(file) {
                Upload.upload({
                    url: ApiConfig.API_URL + '/Util/uploadvideo',
                    data: {
                        token: $rootScope.userProfile.token,
                        file: file
                    }
                }).then(function(data) {
                    if(data.success) {
                        $scope.uploadedVideo = data.filename;
                        console.log($scope.uploadedVideo);                        
                        $('.video-select-box').hide();
                        $('.video-preview-box').show();
                    }
                }, function(error) {

                }).catch(function(e) {
                                        
                }).finally(function() {

                }); 
            }
        }
    };
    $scope.uploadFiles = function (files) {
        if($scope.imagesUploaded <= 6) {
            if (files && files.length) {   
                _.forEach(files, function() {
                    $scope.imagesUploaded += 1;                
                });                                   
                Upload.upload({
                    url: ApiConfig.API_URL + '/Util/upload',
                    data: {
                        token: $rootScope.userProfile.token,
                        file: files
                    }
                }).then(function(data) {
                    if(data.success) {
                        // $('.placeholder-image-upload-box').hide();                        
                        for(var i = 0, j = $scope.uploadedFilesList.length; i < data.files.length; i++,j++) {
                            $scope.uploadedFilesList[j] = data.files[i];
                        }                        
                        // $('.uploaded-image-list').show();
                        console.log($scope.uploadedFilesList);
                        
                    }                                                                                
                }, function(error) {
                                        
                }).catch(function(e) {
                                        
                }).finally(function() {

                });                            
            }
        }
    }

    $(document).on('click','.remove-image-icon', function() {
        console.log($(this).data('name'));        
        var filename = $(this).data('name');
        UtilService.removeUploadedImage({filename: filename}).then(function(data) {
            if(data.success) {
                var index = $scope.uploadedFilesList.indexOf(filename);
                if(index > -1) {
                    $scope.uploadedFilesList.splice(index, 1);
                }
                $scope.imagesUploaded--;
            }
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {
        });
    });
    $(document).on('click','.remove-video-icon', function() {
        console.log($(this).data('name'));        
        var filename = $(this).data('name');
        UtilService.removeUploadedImage({filename: filename}).then(function(data) {
            if(data.success) {
                $scope.uploadedVideo = '';
                $('.video-preview-box').hide();
                $('.video-select-box').show();                
            }
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {
        });
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
            // if($('.ing-search-hdn-input').attr('data-cnt') == 3) {
            $location.path("/ingredients/search/" + $('.ing-search-hdn-input').val());
            // }         
        }
        else if(key === 9) {         
            if ($(this).val() !== "") {
                addtags($(this).val());                
            }
            // return false;
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

    $scope.acIng = function(key, $index) {             
        key = key.replace(/^[!@#$%^&*()-+_='";:,.<>?/[\]{}']/g, '');                    
        if ($.trim(key) === '') {                           
            return;
        }
        else { 
            UtilService.autocompleteIngredients(key).then(function(data) {
                $('.ing-autocomplete-dropdown').show();        
                $scope.autocompleteIngList = data.results;
                var offset = $('#input-ing-' + $index).offset();
                $('.ing-autocomplete-dropdown').css({'top': offset.top + 40 + 'px'});
            }, function(error) {
                                  
            }).catch(function(e) {
                                  
            }).finally(function() {
                
            });
            
        }
    };

    $scope.acClickIng = function(val, $index) {
        $scope.listOfIngredients[$index].name = val;
        $scope.autocompleteIngList = [];
        $('.ing-autocomplete-dropdown').hide();                    
    };

    $scope.acSelectIng = function($event, $index) {
        var $listItems = $('.ing-autocomplete-dropdown > ul > li');
        var key = $event.keyCode, 
            $selected = $listItems.filter('.selected'), 
            $current;

        if (key !== 40 && key !== 38 && key !== 13 && key !== 27) {
            return;
        }
        $listItems.removeClass('selected');
        if (key === 40) {            
            if (!$selected.length || $selected.is(':last-child')) {
                $current = $listItems.eq(0);
            }
            else
                $current = $selected.next();
        }
        else if (key === 38) {            
            if (!$selected.length || $selected.is(':first-child')) {
                $current = $listItems.last();
            }
            else
                $current = $selected.prev();
        }
        else if (key === 13) {                
            $scope.listOfIngredients[$index].name = $selected['0'].innerText;        
            $scope.autocompleteIngList = [];
            $('.ing-autocomplete-dropdown').hide();            
            return false;
        }
        $current.addClass('selected');
    };

    function processIngredientSearch() {           
        // var div = document.getElementById('keyword-box'); 
        // var linkElem = document.createElement('a');
        // linkElem.setAttribute("href", "/#!/ingredients/search/" + $('.ing-search-hdn-input').val());
        // linkElem.setAttribute("id", "ing-search-link");        
        // div.appendChild(linkElem);
        // document.getElementById('ing-search-link').click();
        $location.path("/ingredients/search/" + $('.ing-search-hdn-input').val());
        // if($scope.ingSearchKeyword == '') {
        // } else {
        //     $location.path('/ingredients/search/' + $scope.ingSearchKeyword + '/' + $('.ing-search-hdn-input').val());
        // }
    }

    $('.r-card-image img').visibility({
        type       : 'image',
        transition : 'fade in',
        duration   : 1000
    });   

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

    $scope.toggleNewRecipeBox = function(val) {
        if(val == 1) { //SlideDown			
            $('.new-recipe-box').slideDown(function() {					
                $('.feed-box').css('margin-top', '10px');				
                $('.toggle-recipe-box-btn').hide();		
                $('body').addClass('noscroll');                    
            });			
        } else { //SlideUp
            $('.new-recipe-box').slideUp(function() {
                $('.feed-box').css('margin-top', '50px');
                $('body').removeClass('noscroll');			
                $('.toggle-recipe-box-btn').show();
            });			
        }
    }


    $scope.saveSignupUserProfile = function(signUpModalProfile) {
        signUpModalProfile.food_group = computeFoodGroupValue($scope.modalFoodGrpVal);        
        signUpModalProfile.profile_imagepath = '';
        signUpModalProfile.followed_cuisines = $('.selected-cuisines').val();            
        signUpModalProfile.pref_cuisine = $('.modal-cuisine-dropdown .menu').find('.item.active.selected').data('value');

        $('.save-signup-profile-btn').addClass('icon loading');        
        SettingService.saveUserProfile(signUpModalProfile).then(function(data) {
            if(data.success) {
                $('.user-profile-signup-modal').modal('hide');
                $('.status-msg-modal').modal('show', function() {
                    onVisible: setTimeout(function() {
                        $('.status-msg-modal').modal('hide');
                    }, 1500)
                });
                $cookies.remove('new-access');  
                getRecipes();
            }                  
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {

        });                
    };     
    
    $('.recipe-tabs-mobile li').on('click', function() {
        var tab = $(this).data('tab');
        var elem = $(this);
        if(tab == 1) { //Trending            
            $('.favourites-pane').removeClass('show-for-mobile').addClass('hidden-for-mobile-and-tablet');
            $('.left-pane').removeClass('show-for-mobile').addClass('hidden-for-mobile');
            $('.right-pane-fixed').removeClass('hidden-for-mobile-and-tablet').addClass('show-for-mobile');
            $('.recipe-tabs-mobile li').removeClass('active-tab');
            $(elem).addClass('active-tab');
        } else if(tab == 2) { //Home
            $('.right-pane-fixed,.favourites-pane').removeClass('show-for-mobile').addClass('hidden-for-mobile-and-tablet');
            $('.left-pane').removeClass('hidden-for-mobile').addClass('show-for-mobile');
            $('.recipe-tabs-mobile li').removeClass('active-tab');
            $(elem).addClass('active-tab');
        } else if(tab == 3) { //Favourites
            $('.right-pane-fixed').removeClass('show-for-mobile').addClass('hidden-for-mobile-and-tablet');
            $('.left-pane').removeClass('show-for-mobile').addClass('hidden-for-mobile');
            $('.favourites-pane').removeClass('hidden-for-mobile-and-tablet').addClass('show-for-mobile');
            $('.recipe-tabs-mobile li').removeClass('active-tab');
            $(elem).addClass('active-tab');
        }        
    });
    
}).filter('range', function() {
    return function(input, total) {
      total = parseInt(total);
      for (var i=0; i<total; i++)
        input.push(i);
      return input;
    };
});