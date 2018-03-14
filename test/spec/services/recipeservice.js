'use strict';

describe('Service: RecipeService', function () {

  // load the service's module
  beforeEach(module('whatsCookingApp'));

  // instantiate service
  var RecipeService;
  beforeEach(inject(function (_RecipeService_) {
    RecipeService = _RecipeService_;
  }));

  it('should do something', function () {
    expect(!!RecipeService).toBe(true);
  });

});
