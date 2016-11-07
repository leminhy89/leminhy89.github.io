angular.module('mainCtrl', [])

.controller('MainController', function ($scope, $rootScope, $location, $interval,$mdToast, Search, $localStorage, $mdDialog) {

  var vm = this;

  var last = {
      bottom: true,
      top: false,
      left: true,
      right: false
    };

  vm.listTopicsWord = "";

	Search.getAllTopics()
			.then(function (data) {
				vm.listTopics = data.data.topics;
        vm.selectedTopics = vm.listTopics;
        angular.forEach(vm.listTopics, function (data) {
            vm.listTopicsWord = vm.listTopicsWord + "【 " +data.name+ " 】";
          },vm.listTopicsWord)
			  });

	Search.getAllSources()
			.then(function (data) {
				vm.listSource = data.data.sources;
			})

	Search.getAllSourceGroup()
			.then(function (data) {
				vm.listSourceGroup = data.data.groups;
			});

	vm.transformChip =  transformChip;
  vm.autocompleteDemoRequireMatch = true;
  vm.selectedItem = null;
  vm.selectedTopics = [];
  vm.searchText = "";
  vm.currentDate = new Date();
  vm.fromDate = new Date(
    vm.currentDate.getFullYear(),
    vm.currentDate.getMonth(),
    vm.currentDate.getDate() - 1);
  vm.toDate = new Date();
  vm.minDate = new Date(
    vm.fromDate.getFullYear(),
    vm.fromDate.getMonth() - 2,
    vm.fromDate.getDate()
  );
  vm.fromHours = "09:00";
  vm.toHours = vm.currentDate.getHours() +":"+vm.currentDate.getMinutes();
  vm.activateSearch = false;
  vm.determinateValue = 30;
  vm.listResult = [];
  vm.isSearch = false;
  vm.chkSelected = [];
  vm.toastPosition = angular.extend({},last);

  $interval(function() {

    vm.determinateValue += 1;
    if (vm.determinateValue > 100) {
      vm.determinateValue = 30;
    }
  }, 100);

  vm.doSearch = function () {
    var a = vm.selectedTopics;
    vm.activateSearch = true;
    vm.listResult = [];
    var searchData = {};
    var lstTopicsIds = [];
    var fdate = "";
    var tDate = "";
    
    //get list topics id
    angular.forEach(vm.listTopics, function (value) {
      this.push(value.id)
    }, lstTopicsIds);

    //get publish date condition
    var gfY = vm.fromDate.getFullYear();
    var gtY = vm.toDate.getFullYear();    
    var gfM = vm.fromDate.getMonth()+1 < 10 ? "0"+(vm.fromDate.getMonth()+1) : vm.fromDate.getMonth()+1;
    var gtM = vm.toDate.getMonth()+1 < 10 ? "0"+(vm.toDate.getMonth()+1) : vm.toDate.getMonth()+1;
    var gfD = vm.fromDate.getDate() < 10 ? "0" + vm.fromDate.getDate() : vm.fromDate.getDate();
    var gtD = vm.toDate.getDate() < 10 ? "0" + vm.toDate.getDate() : vm.toDate.getDate();
    var gfH = checkHours(vm.fromHours);
    var gtH = checkHours(vm.toHours); 
    
    fromDate = gfY + "-" + gfM + "-" + gfD + "T" + gfH +":00+09:00";
    toDate = gtY + "-" + gtM + "-" + gtD + "T" + gtH +":00+09:00";
    
    searchData = {
      'ids' : lstTopicsIds,
      'published_at_from' : fromDate,
      'published_at_to' : toDate,
      'num' : 20,
      'explain' : true
    }   

    Search.doSearch(searchData)
      .then(function (res) {
        var lsData = res.data.multicontents;

        angular.forEach(lsData, function (data) {
          var topic = data.topics_words.name;
          angular.forEach(data.contents, function (item) {
            this.push({topic: topic, item: item});  
          },vm.listResult)
        });

        vm.listResult = vm.listResult.sort(function(a,b) {
          return b.item.score - a.item.score;
        });
        
        vm.activateSearch = false;
        vm.isSearched = true;
      });     
  }

  vm.toggle = function (item, list) {
    var idx = list.indexOf(item);
    if (idx > -1) {
      list.splice(idx, 1);
    }
    else {
      list.push(item);
    }
  };

  vm.exists = function (item, list) {
    return list.indexOf(item) > -1;
  };

  vm.openSelected = function() {
    console.log(vm.chkSelected);
    if (vm.chkSelected.length == 0) {
      vm.showErrorMessage();
    } else {
      window.localStorage.setItem('listItem', JSON.stringify(vm.chkSelected));
      DisplayPopupCenter("listItems.html","List Items",800,500);
    }
  }

  vm.showDialog = function() {
    var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         ok: "OK",
         template:
          '<md-dialog aria-label="Mango (Fruit)">'+
          ' <form ng-cloak>'+
          '   <md-toolbar>'+
          '     <div class="md-toolbar-tools">'+
          '       <h2>選択した記事</h2>'+
          '       <span flex></span>'+     
          '       <button class="md-icon-button md-button md-ink-ripple" type="button" ng-click="closeDialog()">'+
          '       Ｘ'+
          '       </button>'+
          '     </div>'+
          '   </md-toolbar>'+
          '   <md-dialog-content>'+
          '     <div class="md-dialog-content">'+
          '       <md-list>'+
          '         <md-list-item class="md-3-line" ng-repeat="item in items">'+
          '           <div class="md-list-item-text" layout="column">'+
          '             <h3> <span>・</span>{{ item.item.title }}</h3>'+
          '             <h4><a href="{{ item.item.url }}" target="_blank">{{ item.item.url }}</h4>'+
          '           </div>'+
          '         </md-list-item>'+
          '       </md-list>'+
          '     </div>'+
          '   </md-dialog-content>'+

          ' </form>'+
          '</md-dialog>',
         locals: {
           items: vm.chkSelected
         },
         controller: DialogController
      });
  };

  vm.cutURL = function(url) {
    if (url.endsWith("/?ref=kamelio")) {
      url = url.replace("?ref=kamelio","");
    }    
    return url;
  }

  function DisplayPopupCenter(url, title, w, h) {    
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
  }

  vm.showErrorMessage = function() {
    var pinTo = vm.getToastPosition();

    $mdToast.show(
      $mdToast.simple()
        .textContent('Please select item to view!')
        .position(pinTo )
        .hideDelay(3000)
    );
  };
  
  vm.getToastPosition = function() {
    sanitizePosition();

    return Object.keys(vm.toastPosition)
      .filter(function(pos) { return vm.toastPosition[pos]; })
      .join(' ');
  };

  function sanitizePosition() {
    var current = vm.toastPosition;

    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;

    last = angular.extend({},current);
  }

  function transformChip (chip) {
  	if (angular.isObject(chip)) {
      return chip;
    }
    // Otherwise, create a new one
    return { name: chip, type: 'new' }
  }

  function checkHours(fromHours) {
    //"09:09"
    var res = "";
    var fH = fromHours;
    var idx = fH.split(":");
    if (idx.length == 2) {
      var h = idx[0];
      h = convertTH(h);
      var m = idx[1];
      m = convertTH(m);
      res = h+":"+m;
    } else {
      res = "00:00";
    }
    return res;
  }

  function convertTH(data) {
    if (data != undefined) {
        if (data.length < 2) {
          data = "0"+data;
        } else if (data.length > 2) {
          data = "00";
        }  
    } else {
      data = "00";
    }

    return data;
  }

  function DialogController($scope, $mdDialog, items) {
    $scope.items = items;
    $scope.closeDialog = function() {
      $mdDialog.hide();
    }
  }

})