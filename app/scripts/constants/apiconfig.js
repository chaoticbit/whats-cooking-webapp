"use strict";

angular.module('whatsCookingApp').factory('ApiConfig', function() {
    // var API_URL = 'http://216.37.103.147/whats-cooking-api/api';
    var API_URL = 'http://216.37.103.147/whats-cooking-api/api';
    var API_KEY = 'food-food';    
    return {
        API_URL: API_URL,
        API_KEY: API_KEY,
    };
});