'use strict';

/**
 * @ngdoc function
 * @name whatsCookingApp.controller:RecipeCtrl
 * @description
 * # RecipeCtrl
 * Controller of the whatsCookingApp
 */
angular.module('whatsCookingApp').controller('RecipeCtrl', function ($scope, $routeParams, $window, RecipeService, UtilService, localStorageService) {
    $scope.rid = $routeParams.id;

    // $('.loader-bg').show();
    // RecipeService.getRecipeById($scope.rid).then(function(data) {
    //     if(data.success) {
    //         console.log(data.results);
    //     } else {
    //         window.location.href = '/';
    //     }                    
    // }, function(error) {
                            
    // }).catch(function(e) {
                            
    // }).finally(function() {
    //     $('.loader-bg').hide();
    // });

    $('.ui.rating').rating('disable');

    $scope.getStars = function(rating) {
        // Get the value
        var val = parseFloat(rating);
        // Turn value into number/100
        var size = val/5*100;
        return size + '%';
      }

    var scaleUp = function(imagepath) {
        var img = imagepath
        $('<div class="image-theatre-wrapper">\n\
            <div class="area-photo"><i class="fa fa-times fg-gray close-image-theatre pointer" style="font-size: 17px;z-index:99999;position: absolute;right:20px;top:10px;"></i>\n\
                <div class="theatre-photo-container">\n\
                    <img src="" class="theatre-photo" />\n\
                </div>\n\
            </div>\n\
        </div>').insertAfter('.container-fluid');
        $('.image-theatre-wrapper').show();
        $(".theatre-photo").attr("src", img).on('load',function() {
            $(".theatre-photo-container").fadeTo(100,9,function(){
                var h_d = $('.theatre-photo').height();
                var h_p = $('.theatre-photo').parent().height();
                var margin = (h_p - h_d) / 2;
                var scale = (window.innerHeight)/h_p;
                $('.theatre-photo').addClass('scaleUp');
                $('.theatre-photo').css({transform: 'scale(' + scale + ')'});
                $('.theatre-photo').css("margin-top", margin+'px');
            });          
        });
    };
    
    $('.thumbnail').bind('click', function(){
        scaleUp($(this).attr('data-image'));
    });    

    $(window).scroll(function(){
        if($('.image-theatre-wrapper').length > 0){
            $('.theatre-photo').css({transform:'scale(0.5)',transition:'all 1s ease-out',transformOrigin:'center top 0'});
            $('.image-theatre-wrapper').fadeTo(300,0,function(){
                $(this).remove();
            });            
        } 
    });
    $(document).on('keydown',function(e){
        if($('.image-theatre-wrapper').length > 0){
            if(e.keyCode === 27){
                $('.theatre-photo').css({transform:'scale(0.5)',transition:'all 1s ease-out',transformOrigin:'center top 0'});
                $('.image-theatre-wrapper').fadeTo(300,0,function(){
                    $(this).remove();
                });            
            }
        } 
        if($('.modal-wrapper').length > 0){
            if(e.keyCode === 27){
                $('.modal-wrapper').fadeOut(100,function(){ $('.modal-wrapper').remove();});
                $('body').removeClass('offscroll');
            }
        }
        if($('li.thread').hasClass('editableon')){
            if(e.keyCode === 27){
                cancel_edit();
            }
        }
    });
    $(document).on('click','.close-image-theatre',function(){
        $('.theatre-photo').css({transform:'scale(0.5)',transition:'all 1s ease-out',transformOrigin:'center top 0'});
        $('.image-theatre-wrapper').fadeTo(300,0,function(){
                $(this).remove();
        }); 
    });
    $(document).on('click','.theatre-photo',function(){
        $('.theatre-photo').css({transform:'scale(0.5)',transition:'all 1s ease-out',transformOrigin:'center top 0'});
        $('.image-theatre-wrapper').fadeTo(300,0,function(){
                $(this).remove();
        }); 
    });

    $('.views-to-thread').on('click',function(){                
        $('<div class="modal-wrapper">\n\
            <div class="pure-g">\n\
            <div class="pure-u-1 pure-u-md-1-3 bg-white modal-content" style="margin-top: 50px;position: relative;">\n\n\
            <span class="close-modal pointer" style="right: 10px;top: 38px;font-size: 18px;position:absolute;"><i class="fa fa-times fg-grayLighter"></i></span>\n\
            <h5 class="fg-grayLight light" style="padding: 10px;border-bottom: 1px solid rgba(0,0,0,0.05);font-size: 16pt;">Views</h5>\n\
            <ul class="modal-ul"></ul>\n\
            </div>\n\
            </div>\n\
            </div>').insertAfter('.container-fluid').addClass('pop-in');
            
        $('body').addClass('noscroll');
        $('.modal-content ul').html(result.content);                                    
    });
    $(document).on('click','.close-modal',function(){
       $('.modal-wrapper').fadeOut(100,function(){
           $(this).remove();
       });
    });
});
