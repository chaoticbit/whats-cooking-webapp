"use strict";

angular.module('whatsCookingApp').factory('ApiConfig', function() {
    var API_URL = 'http://localhost/whats-cooking-api/api';

    return {
        API_URL: API_URL
    };
});