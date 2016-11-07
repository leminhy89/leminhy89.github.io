angular.module('seItemCtrl', [])

.controller('SelectedItemController', function ($scope) {
	var vm = this;  				
    vm.chkSelected = JSON.parse(window.localStorage.getItem('listItem'));    
    vm.cutURL = function(url) {
    if (url.endsWith("/?ref=kamelio")) {
      url = url.replace("?ref=kamelio","");
    }    
    return url;
  }
})