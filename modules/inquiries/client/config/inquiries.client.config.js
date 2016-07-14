(function () {
  'use strict';

  angular
    .module('inquiries')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Inquiries',
      state: 'inquiries',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'inquiries', {
      title: 'List Inquiries',
      state: 'inquiries.list',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'inquiries', {
      title: 'Create Inquiry',
      state: 'inquiries.create',
      
    });
  }
})();
