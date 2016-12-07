app.controller('indexCtrl', function($scope, $cordovaImagePicker, $ionicActionSheet, $ionicPopup, $ionicSlideBoxDelegate, $ionicScrollDelegate) {

  $scope.mainPageSlider = 0;
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
  };


  // show switch rss popup
  $scope.showSwitchRssPrompt = function() {
    $ionicPopup.show({
      template: '<input type="text" ng-model="rssUrl" placeholder="Enter address...">',
      title: '输入RSS源网址:',
      scope: $scope,
      buttons: [
        { text: '取消' },
        {
          text: '<b>保存</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.rssUrl) {
              e.preventDefault();
            } else {
              return $scope.rssUrl;
            }
          }
        }
      ]
    }).then(function(res) {
      if (res) {
        window.localStorage['RssUrl'] = res;
        $scope.refreshRssList();
      }
    });
  };


  // open picture library
  var openPictureLib = function() {
    // TODO
    var options = {
      maximumImagesCount: 10,
      width: 800,
      height: 800,
      quality: 80
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {
        for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
        }
      }, function(error) {
        // error getting photos
      });
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

});
