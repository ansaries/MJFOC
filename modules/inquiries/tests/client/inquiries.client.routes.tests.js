(function () {
  'use strict';

  describe('Inquiries Route Tests', function () {
    // Initialize global variables
    var $scope,
      InquiriesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _InquiriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      InquiriesService = _InquiriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('inquiries');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/inquiries');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          InquiriesController,
          mockInquiry;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('inquiries.view');
          $templateCache.put('modules/inquiries/client/views/view-inquiry.client.view.html', '');

          // create mock Inquiry
          mockInquiry = new InquiriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Inquiry Name'
          });

          //Initialize Controller
          InquiriesController = $controller('InquiriesController as vm', {
            $scope: $scope,
            inquiryResolve: mockInquiry
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:inquiryId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.inquiryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            inquiryId: 1
          })).toEqual('/inquiries/1');
        }));

        it('should attach an Inquiry to the controller scope', function () {
          expect($scope.vm.inquiry._id).toBe(mockInquiry._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/inquiries/client/views/view-inquiry.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          InquiriesController,
          mockInquiry;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('inquiries.create');
          $templateCache.put('modules/inquiries/client/views/form-inquiry.client.view.html', '');

          // create mock Inquiry
          mockInquiry = new InquiriesService();

          //Initialize Controller
          InquiriesController = $controller('InquiriesController as vm', {
            $scope: $scope,
            inquiryResolve: mockInquiry
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.inquiryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/inquiries/create');
        }));

        it('should attach an Inquiry to the controller scope', function () {
          expect($scope.vm.inquiry._id).toBe(mockInquiry._id);
          expect($scope.vm.inquiry._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/inquiries/client/views/form-inquiry.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          InquiriesController,
          mockInquiry;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('inquiries.edit');
          $templateCache.put('modules/inquiries/client/views/form-inquiry.client.view.html', '');

          // create mock Inquiry
          mockInquiry = new InquiriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Inquiry Name'
          });

          //Initialize Controller
          InquiriesController = $controller('InquiriesController as vm', {
            $scope: $scope,
            inquiryResolve: mockInquiry
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:inquiryId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.inquiryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            inquiryId: 1
          })).toEqual('/inquiries/1/edit');
        }));

        it('should attach an Inquiry to the controller scope', function () {
          expect($scope.vm.inquiry._id).toBe(mockInquiry._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/inquiries/client/views/form-inquiry.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
