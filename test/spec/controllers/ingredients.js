'use strict';

describe('Controller: IngredientsCtrl', function () {

  // load the controller's module
  beforeEach(module('whatsCookingApp'));

  var IngredientsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IngredientsCtrl = $controller('IngredientsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(IngredientsCtrl.awesomeThings.length).toBe(3);
  });
});
