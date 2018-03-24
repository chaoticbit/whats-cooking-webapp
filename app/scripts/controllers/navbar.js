'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('NavbarCtrl', function ($rootScope, $window, $scope, $location, SearchService, UtilService) {
    $rootScope.listOfCuisines = [];
    $scope.quickSearchResults = '';
    $scope.favourites = [];
    $rootScope.showRecipeBox = false;    

    function getCuisines() {
        UtilService.getCuisines().then(function(data) {
            if(data.success) {
                _.forEach(data.results, function(value, key) {
                    $rootScope.listOfCuisines.push({
                        'name': value.name,
                        'value': value.srno,
                        'imagepath': value.imagepath,
                        'uid': value.uid,
                        'count': value.count
                    });
                });                    
                
                $('.modal-cuisine-dropdown').dropdown({
                    values: $rootScope.listOfCuisines,        
                    placeholder: 'Cuisines',
                    onChange: function(value) {
                        $scope.signUpModalProfile.pref_cuisine = value;
                    }
                });                

                $('.cuisine-dropdown').dropdown({
                    values: $rootScope.listOfCuisines,        
                    placeholder: 'Cuisines',
                    onChange: function(value) {
                        $scope.selectedCuisine = value;
                    }
                });
            }
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {
        }); 
    }

    function getFavourites() {
        UtilService.getFavourites().then(function(data) {
            if(data.success) {
                $scope.favourites = data.results;                
            }                        
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {
        });
    } 

    (function() { 
        getCuisines();
        getFavourites();
    })();

    $(document).on('click', '.update-cuisine-btn', function() {
        var cid = $(this).data('cid');
        var uid = $rootScope.userProfile.userid; 
        var addIndex = -1;                                           
        var removeIndex = -1;
        var list = $rootScope.listOfCuisines;
        var i = 0;
        var elem = $(this);

        $(this).addClass('icon loading');
        UtilService.updateCuisine({cid: cid}).then(function(data) {
            if(data.success) {
                $(elem).removeClass('icon loading');
                for(i; i < list.length; i++) {
                    if(list[i].uid === uid && list[i].value == cid) {
                      removeIndex = i;
                      break;
                    }
                    else if(list[i].uid === null && list[i].value == cid) {
                        addIndex = i;
                        break;
                    }
                }
        
                if(addIndex == -1) {            
                    $rootScope.listOfCuisines[removeIndex].uid = null;
                    $(elem).removeClass('followed');
                    console.log($rootScope.listOfCuisines[removeIndex]);            
                } else if(removeIndex == -1) {
                    $rootScope.listOfCuisines[addIndex].uid = uid;
                    $(elem).addClass('followed');
                    console.log($rootScope.listOfCuisines[addIndex]);            
                }

                getRecipes();
                // $scope.$apply();
            }                        
        }, function(error) {
                            
        }).catch(function(e) {
                            
        }).finally(function() {
        });                                    
    });   

    $(document).ready(function() {
        $('.headbar-user-dropdown').dropdown();        
        $('.favourites-user-dropdown').dropdown({
            action: 'nothing'
        })
        $('.user-action-dropdown').dropdown();   
        $('.cuisine-nav-dropdown').dropdown({
            action: 'nothing'
        });
    });    

    $rootScope.addToFavourites = function(rid, $event) {                
        var elem = $event.currentTarget;        
        if($(elem).hasClass('nav-menu-fav')) {
            UtilService.removeFromFavourites({rid: rid}).then(function(data) {
                if(data.success) {
                    $(elem).closest('.item').fadeOut(300, function() {
                        $(elem).closest('.item').remove();
                    });
                }                   
            }, function(error) {
                                  
            }).catch(function(e) {
                                  
            }).finally(function() {
    
            });              
        }
        else if ($(elem).hasClass('added')) { //remove from favourites            
            UtilService.removeFromFavourites({rid: rid}).then(function(data) {
                if(data.success) {
                    $(elem).removeClass('fg-red added').addClass('outline');
                    getFavourites();
                }                   
            }, function(error) {
                                  
            }).catch(function(e) {
                                  
            }).finally(function() {
    
            });              
        } else { //add to            
            UtilService.addToFavourites({rid: rid}).then(function(data) {
                if(data.success) {
                    $(elem).removeClass('outline').addClass('fg-red added');
                    getFavourites();
                }                   
            }, function(error) {
                                  
            }).catch(function(e) {
                                  
            }).finally(function() {
    
            });        
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

        $(document).on('mouseup touchstart', function (e) {
            var search_container = $(".search-dropdown");
            if (!search_container.is(e.target) && search_container.has(e.target).length === 0)
            {
                search_container.hide();
                $(".search-wrapper").hide();
                $('body').removeClass('noscroll');
            }        
        });
    
        $('.global-search').on('input', function () {
            $(this).val($(this).val().replace(/^[!@#$%^&*()-+_='";:,.<>?/[\]{}']/g, ''));
            $('.search-wrapper,.search-dropdown').show();
            $('body').addClass('noscroll');
            var val = $.trim($(this).val());
            var elem = $(this);
            if ($.trim(val) === '') {               
                $scope.quickSearchResults = '';         
                $scope.$apply();
                return;
            }
            else {
                if (val.charAt(0) !== '>' && val.charAt(0) !== '<') { 
                    $(elem).parent().addClass('loading');
                    SearchService.quickSearch(val).then(function(data) {
                        if(data.success) {
                            $scope.quickSearchResults = data.results;                                                                                                            
                        }                                    
                    }, function(error) {
                                          
                    }).catch(function(e) {
                                          
                    }).finally(function() {
                        $(elem).parent().removeClass('loading');
                    });
                }
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
            if(key === 8 && $(this).val() == '') {            
                $scope.quickSearchResults = '';         
            }
        });    

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
