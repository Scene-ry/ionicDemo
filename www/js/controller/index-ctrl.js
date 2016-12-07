app.controller('indexCtrl', ['$scope', '$http', '$ionicActionSheet', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', function($scope, $http, $ionicActionSheet, $ionicSlideBoxDelegate, $ionicScrollDelegate) {

  $scope.mainPageSlider = 0;
  //$scope.showGoTopButton = false;
  $scope.isImageShow = true;

  var tabItems = $('.tab-item');

  // get rss test
  $scope.rssUrl = window.localStorage['RssUrl'] || 'http://feed.cnblogs.com/news/rss';
  $scope.refreshRssList = function() {
    $.ajax({
      type: 'GET',
      url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=1000&callback=?&q=' + encodeURIComponent($scope.rssUrl),
      dataType: 'json',
      error: function() {
        alert("feed read failed.");
      },
      success: function(response) {
        //console.log(response.responseData.feed.entries);
        $scope.rssList = response.responseData.feed.entries;
        $scope.$apply();
      },
      complete: function() {
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  };

  // change color of tab icon when slider slides
  $scope.slideHasChanged = function(selectedIndex) {
    tabItems.each(function() {
      $(this).removeClass('idemo-selected');
    });
    tabItems.eq(selectedIndex).addClass('idemo-selected');

    // var bottomBarHeight = parseFloat($('.idemo-bottom').css('height'));
    // var currentSlideHeight = parseFloat($('.slider-slide:eq(' + selectedIndex + ')').css('height'));
    // var windowHeight = window.screen.height - bottomBarHeight - 11;

    // if (currentSlideHeight <= window.screen.height) {
    //   $('.slider').css({ 'maxHeight': windowHeight + 'px', 'marginBottom': '0' });
    // } else {
    //   $('.slider').css({ 'maxHeight': currentSlideHeight + 'px', 'marginBottom': '60px' });
    // }
  };


  // show switch rss popup
  $scope.showSwitchRssPrompt = function() {
    var url = prompt('输入RSS源网址:', $scope.rssUrl);
    if (url != null && url != '') {
      $scope.rssUrl = url;
      window.localStorage['RssUrl'] = url;
      $scope.refreshRssList();
    }
  };


  // show go top button
  // $scope.showOrHideGoTop = function() {
  //   var top = $ionicScrollDelegate.getScrollPosition().top;
  //   if (top > 200) {
  //     $scope.showGoTopButton = true;
  //   } else {
  //     $scope.showGoTopButton = false;
  //   }
  //   $scope.$apply();
  // };

  // go top button
  // $scope.goToListTop = function() {
  //   $ionicScrollDelegate.scrollTop();
  // };


  // open picture library
  var openPictureLib = function() {
    // TODO
    console.log("pic library opened");
  };

  // open camera to change user avatar
  var openCamera = function() {
    // TODO
    console.log("camera opened");
  };


  // popup to choose local pic or take photo
  $scope.showChangeAvatarPopup = function() {
    $ionicActionSheet.show({
      buttons: [
        { text: '<i class="icon ion-image"></i>本地图片' },
        { text: '<i class="icon ion-camera"></i>拍照上传' }
      ],
      titleText: '修改头像',
      buttonClicked: function(index) {
        switch (index) {
          case 0:
            openPictureLib();
            return true;
          case 1:
            openCamera();
            return true;
          default:
            return true;
        }
      }
    });
  };


  // show image or not
  $scope.isImageShowChange = function() {
    $scope.isImageShow = !$scope.isImageShow;
  };


  // switch slider when tab icon clicked
  tabItems.each(function(index) {
    $(this).click(function() {
      if (index == 0 && $scope.mainPageSlider == 0) {
        $ionicScrollDelegate.scrollTop();
        return;
      }
      $ionicSlideBoxDelegate.slide(index);
    });
  });

  // initialize list
  $scope.refreshRssList();

}]);
