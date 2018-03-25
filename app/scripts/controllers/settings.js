'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('SettingsCtrl', function ($rootScope, $scope, $timeout, $window, ApiConfig, AuthenticationService, UtilService, SettingService, Upload) {    

    $scope.profile = {};
    $scope.foodGrpVal = [];        
    $scope.cid = 1;
    var cuisines = $rootScope.listOfCuisines;
    $scope.username = '';
    $scope.email = '';
    $scope.uploadedProfileImage = '';

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

            $scope.profile.password = $scope.profile.password.substring(0, 30);
            $scope.username = $scope.profile.username;
            $scope.email = $scope.profile.email;

            $timeout(function() {
                $('.food-group-dropdown').dropdown({                        
                    useLabels: false,
                    onChange: function(value) {
                        computeFoodGroupValue($scope.foodGrpVal);
                    }
                });                     
                var index = -1;
            for(var i = 0; i < cuisines.length; i++) {
                if(cuisines[i].value == $scope.profile.cid) {
                    index = i;
                    break;
                }
            };
            cuisines[index]['selected'] = true;            
            
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
        $scope.profile.food_group = computed;
        console.log($scope.profile.food_group);        
    }

    $scope.uploadProfilePicture = function(file) {
        if($scope.uploadedProfileImage == '') {
            if(file) {
                Upload.upload({
                    url: ApiConfig.API_URL + '/Util/uploadprofilepicture',
                    data: {
                        token: $rootScope.userProfile.token,
                        file: file
                    }
                }).then(function(data) {
                    if(data.success) {
                        $scope.uploadedProfileImage = data.filename;
                        console.log($scope.uploadedProfileImage);   
                        $('.avatar-settings').removeAttr('style');
                        $('.avatar-settings').css('opacity', '0');
                        $('.avatar-settings').css('background-image', 'url(' + $rootScope.apiurl + '/' + $scope.uploadedProfileImage + ')').animate({opacity: '1'});                                             
                    }
                }, function(error) {

                }).catch(function(e) {
                                        
                }).finally(function() {

                }); 
            }
        }  
    };

    $(document).on('click','.remove-picture-icon', function() {           
        var filename = $scope.uploadedProfileImage
        UtilService.removeUploadedImage({filename: filename}).then(function(data) {
            if(data.success) {
                $scope.uploadedProfileImage = '';
                $('.avatar-settings').removeAttr('style');
                $('.avatar-settings').css('opacity', '0');
                $('.avatar-settings').css('background-image', 'url(../../images/sample.jpg)').animate({opacity: '1'});                                             
            }
        }, function(error) {
                              
        }).catch(function(e) {
                              
        }).finally(function() {
        });
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

    //avatar defocus panel
    $('.avatar-settings').on('mouseover', function () {
        $('.avatar-defocus').show();
    });
    $('.avatar-settings').on('mouseout', function () {
        $('.avatar-defocus').hide();
    });

    $(".s-username-input input").bind('input', function () {
        $(this).val($(this).val().replace(/\s/g, '_'));     
        var username = $.trim($(this).val());
        
        if (/^[a-z][a-zA-Z0-9_.]{0,24}$/.test(username)) { 
            if (username.length < 5) {
                $('.s-username-input').removeClass('error');
                $('.s-username-input').find('i').removeClass().hide();
            }
            if (username.length >= 5) { 
                if(username != $scope.username) {
                    $('.s-username-input').find('i').addClass('icon loading').show();
                    AuthenticationService.checkUsername({'username': username}).then(function(data) {
                        if(data.success) {
                            $scope.validUsername = false;
                            $('.s-username-input').addClass('error');
                            $('.s-username-input').find('i').removeClass().addClass('icon cancel fg-red').show();                                                
                        } else {
                            $scope.validUsername = true;
                            $('.s-username-input').removeClass('error');
                            $('.s-username-input').find('i').removeClass().addClass('icon check fg-green').show();                                                
                        }            
                    }, function(error) {
                                        
                    }).catch(function(e) {
                                        
                    }).finally(function() {
                        
                    });
                }
            }
        } else {
            if(username == "") {
                $('.s-username-input').removeClass('error');
                $('.s-username-input').find('i').removeClass().hide();
            }
        }
    });

    $(".s-email-input input").bind('input', function () { 
        var email = $.trim($(this).val());
        if(email !== "") {
            if(email.substring(email.length - 4) == '.com') {
                if(email != $scope.email) { 
                    $('.s-email-input').find('i').addClass('icon loading').show();
                    AuthenticationService.checkEmail({'email': email}).then(function(data) {
                        if(data.success) {
                            $scope.validEmail = false;
                            $('.s-email-input').addClass('error');
                            $('.s-email-input').find('i').removeClass().addClass('icon cancel fg-red').show();                                                
                        } else {
                            $scope.validEmail = true;
                            $('.s-email-input').removeClass('error');
                            $('.s-email-input').find('i').removeClass().addClass('icon check fg-green').show();
                            $('.signup-btn').removeAttr('disabled');                        
                        }            
                    }, function(error) {
                                        
                    }).catch(function(e) {
                                        
                    }).finally(function() {
                        
                    });
                }
            }            
        }
        else {
            $('.s-email-input').removeClass('error');
            $('.s-email-input').find('i').removeClass().hide();
        }
    });

});
