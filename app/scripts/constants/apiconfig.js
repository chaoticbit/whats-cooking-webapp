"use strict";

angular.module('whatsCookingApp').factory('ApiConfig', function() {
    // var API_URL = 'http://localhost/whats-cooking-api/api';
    var API_URL = 'http://localhost/whats-cooking-api/api';
    var API_KEY = 'food-food';    
    return {
        API_URL: API_URL,
        API_KEY: API_KEY,
    };
});