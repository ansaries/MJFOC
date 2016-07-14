'use strict';

describe('Inquiries E2E Tests:', function () {
  describe('Test Inquiries page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/inquiries');
      expect(element.all(by.repeater('inquiry in inquiries')).count()).toEqual(0);
    });
  });
});
