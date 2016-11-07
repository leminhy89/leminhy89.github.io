angular.module('SearchApp', ['ngMaterial','mainCtrl','seItemCtrl','searchService', 'ngStorage','ngDialog'])
.config(($mdIconProvider, $mdThemingProvider) => {
    // Register the user `avatar` icons
    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('red');
  });