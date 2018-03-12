'use strict';

describe('Service: utilservice', function () {

  // load the service's module
  beforeEach(module('whatsCookingApp'));

  // instantiate service
  var utilservice;
  beforeEach(inject(function (_utilservice_) {
    utilservice = _utilservice_;
  }));

  it('should do something', function () {
    expect(!!utilservice).toBe(true);
  });

});
