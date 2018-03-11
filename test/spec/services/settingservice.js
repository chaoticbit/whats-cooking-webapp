'use strict';

describe('Service: SettingService', function () {

  // load the service's module
  beforeEach(module('whatsCookingApp'));

  // instantiate service
  var SettingService;
  beforeEach(inject(function (_SettingService_) {
    SettingService = _SettingService_;
  }));

  it('should do something', function () {
    expect(!!SettingService).toBe(true);
  });

});
