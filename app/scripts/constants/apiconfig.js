"use strict";

angular.module('whatsCookingApp').factory('API_CONFIG', function() {
    var API_URL = 'http://localhost/whats-cooking-api';

    return {
        API_URL: API_URL
    };
});